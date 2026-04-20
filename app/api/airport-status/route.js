const AIRPORTS = [
  { icao: 'OIIE', iata: 'IKA', name: 'امام خمینی', city: 'تهران' },
  { icao: 'OIMM', iata: 'MHD', name: 'مشهد',       city: 'مشهد'  },
  { icao: 'OISS', iata: 'SYZ', name: 'شیراز',       city: 'شیراز' },
  { icao: 'OIFM', iata: 'IFN', name: 'اصفهان',      city: 'اصفهان'},
  { icao: 'OITT', iata: 'TBZ', name: 'تبریز',       city: 'تبریز' },
  { icao: 'OIAW', iata: 'AWZ', name: 'اهواز',       city: 'اهواز' },
]

// Turkish carriers with regular Iran routes
// Pegasus callsign: PGT (hub: LTFJ / SAW Istanbul Sabiha Gökçen)
// AJet (formerly AnadoluJet) callsign: AHY (hub: LTFM / IST Istanbul Grand Airport)
const AIRLINES = [
  {
    name: 'Pegasus Airlines',
    nameFa: 'پگاسوس',
    iata: 'PC',
    callsign: 'PGT',
    hubs: ['LTFJ'],          // SAW — Pegasus primary hub
  },
  {
    name: 'AJet',
    nameFa: 'ای‌جت',
    iata: 'VF',
    callsign: 'AHY',         // AnadoluJet/AJet ICAO callsign
    hubs: ['LTFM', 'LTAC'],  // IST + ESB (Ankara) — AJet operates from both
  },
]

async function fetchDepartures(airportIcao, begin, end) {
  const url = `https://opensky-network.org/api/flights/departure?airport=${airportIcao}&begin=${begin}&end=${end}`
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`OpenSky ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function GET() {
  const now = Math.floor(Date.now() / 1000)
  const twelveHoursAgo = now - 43200

  // ── Iranian airports ──────────────────────────────────────────
  const airportResults = await Promise.allSettled(
    AIRPORTS.map(async (airport) => {
      const flights = await fetchDepartures(airport.icao, twelveHoursAgo, now)
      const international = flights.filter(
        (f) => f.estArrivalAirport && !f.estArrivalAirport.startsWith('OI')
      )
      return {
        ...airport,
        status: international.length > 0 ? 'active' : flights.length > 0 ? 'domestic' : 'quiet',
        intlCount: international.length,
        totalCount: flights.length,
        destinations: [
          ...new Set(international.slice(0, 4).map((f) => f.estArrivalAirport).filter(Boolean)),
        ],
      }
    })
  )

  const airports = airportResults.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...AIRPORTS[i], status: 'unknown', intlCount: 0, totalCount: 0, destinations: [] }
  )

  // ── Turkish carriers (flights TO Iran) ────────────────────────
  const airlineResults = await Promise.allSettled(
    AIRLINES.map(async (airline) => {
      // Fetch departures from all hubs in parallel
      const hubFlights = await Promise.allSettled(
        airline.hubs.map((hub) => fetchDepartures(hub, twelveHoursAgo, now))
      )

      const allFlights = hubFlights.flatMap((r) =>
        r.status === 'fulfilled' ? r.value : []
      )

      // Keep only flights:
      //   1. operated by this airline (callsign prefix)
      //   2. destined for an Iranian airport (ICAO starts with OI)
      const iranFlights = allFlights.filter(
        (f) =>
          f.callsign?.trimEnd().startsWith(airline.callsign) &&
          f.estArrivalAirport?.startsWith('OI')
      )

      const destinations = [
        ...new Set(iranFlights.map((f) => f.estArrivalAirport).filter(Boolean)),
      ]

      return {
        ...airline,
        flightsToIran: iranFlights.length,
        status: iranFlights.length > 0 ? 'active' : 'quiet',
        destinations,
      }
    })
  )

  const airlines = airlineResults.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...AIRLINES[i], flightsToIran: 0, status: 'unknown', destinations: [] }
  )

  return Response.json(
    { airports, airlines, fetchedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }
  )
}
