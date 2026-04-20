const AIRPORT_SETS = {
  fa: [
    { icao: 'OIIE', iata: 'IKA', name: 'امام خمینی', city: 'تهران',  lat: 35.42, lon: 51.15 },
    { icao: 'OIMM', iata: 'MHD', name: 'مشهد',       city: 'مشهد',   lat: 36.24, lon: 59.64 },
    { icao: 'OISS', iata: 'SYZ', name: 'شیراز',       city: 'شیراز',  lat: 29.54, lon: 52.59 },
    { icao: 'OIFM', iata: 'IFN', name: 'اصفهان',      city: 'اصفهان', lat: 32.75, lon: 51.86 },
    { icao: 'OITT', iata: 'TBZ', name: 'تبریز',       city: 'تبریز',  lat: 38.13, lon: 46.23 },
    { icao: 'OIAW', iata: 'AWZ', name: 'اهواز',       city: 'اهواز',  lat: 31.33, lon: 48.76 },
  ],
  en: [
    { icao: 'EGLL', iata: 'LHR', name: 'Heathrow',        city: 'London',   lat: 51.48, lon: -0.46  },
    { icao: 'CYYZ', iata: 'YYZ', name: 'Pearson Intl',    city: 'Toronto',  lat: 43.68, lon: -79.63 },
    { icao: 'YSSY', iata: 'SYD', name: 'Kingsford Smith', city: 'Sydney',   lat: -33.95, lon: 151.18 },
    { icao: 'OMDB', iata: 'DXB', name: 'Dubai Intl',      city: 'Dubai',    lat: 25.25, lon: 55.36  },
    { icao: 'LTFM', iata: 'IST', name: 'Istanbul',        city: 'Istanbul', lat: 41.28, lon: 28.75  },
  ],
  tr: [
    { icao: 'LTFJ', iata: 'SAW', name: 'Sabiha Gökçen',      city: 'İstanbul', lat: 40.90, lon: 29.31 },
    { icao: 'LTFM', iata: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', lat: 41.28, lon: 28.75 },
    { icao: 'LTAC', iata: 'ESB', name: 'Esenboğa',            city: 'Ankara',   lat: 40.13, lon: 32.99 },
    { icao: 'LTBJ', iata: 'ADB', name: 'Adnan Menderes',      city: 'İzmir',    lat: 38.29, lon: 27.16 },
  ],
}

const AIRLINES = [
  { name: 'Pegasus Airlines', nameFa: 'پگاسوس', iata: 'PC', callsign: 'PGT', hubs: ['LTFJ'] },
  { name: 'AJet',             nameFa: 'ای‌جت',  iata: 'VF', callsign: 'AHY', hubs: ['LTFM', 'LTAC'] },
]

async function fetchDepartures(icao, begin, end) {
  const url = `https://opensky-network.org/api/flights/departure?airport=${icao}&begin=${begin}&end=${end}`
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`OpenSky ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'fa'

  const airports = AIRPORT_SETS[lang] || AIRPORT_SETS.fa
  const now = Math.floor(Date.now() / 1000)
  // Use 6h window for foreign airports (less data volume), 12h for Iranian
  const windowStart = now - (lang === 'fa' ? 43200 : 21600)

  const airportResults = await Promise.allSettled(
    airports.map(async (airport) => {
      const flights = await fetchDepartures(airport.icao, windowStart, now)

      if (lang === 'fa') {
        // Iranian airports: classify by international vs domestic departures
        const international = flights.filter(
          (f) => f.estArrivalAirport && !f.estArrivalAirport.startsWith('OI')
        )
        return {
          ...airport,
          status: international.length > 0 ? 'active' : flights.length > 0 ? 'domestic' : 'quiet',
          intlCount: international.length,
          totalCount: flights.length,
          destinations: [...new Set(international.slice(0, 4).map((f) => f.estArrivalAirport).filter(Boolean))],
        }
      } else {
        // Foreign airports: check for any Iran-bound departures
        const iranFlights = flights.filter((f) => f.estArrivalAirport?.startsWith('OI'))
        return {
          ...airport,
          status: iranFlights.length > 0 ? 'iran_routes' : flights.length > 0 ? 'active' : 'quiet',
          iranCount: iranFlights.length,
          totalCount: flights.length,
          destinations: [...new Set(iranFlights.map((f) => f.estArrivalAirport).filter(Boolean))],
        }
      }
    })
  )

  const processedAirports = airportResults.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...airports[i], status: 'unknown', intlCount: 0, iranCount: 0, totalCount: 0, destinations: [] }
  )

  // Turkish carriers section — FA only
  let airlines = []
  if (lang === 'fa') {
    const airlineResults = await Promise.allSettled(
      AIRLINES.map(async (airline) => {
        const hubFlights = await Promise.allSettled(
          airline.hubs.map((hub) => fetchDepartures(hub, windowStart, now))
        )
        const allFlights = hubFlights.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
        const iranFlights = allFlights.filter(
          (f) =>
            f.callsign?.trimEnd().startsWith(airline.callsign) &&
            f.estArrivalAirport?.startsWith('OI')
        )
        return {
          ...airline,
          flightsToIran: iranFlights.length,
          status: iranFlights.length > 0 ? 'active' : 'quiet',
          destinations: [...new Set(iranFlights.map((f) => f.estArrivalAirport).filter(Boolean))],
        }
      })
    )
    airlines = airlineResults.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { ...AIRLINES[i], flightsToIran: 0, status: 'unknown', destinations: [] }
    )
  }

  return Response.json(
    { airports: processedAirports, airlines, fetchedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }
  )
}
