const AIRPORTS = [
  { icao: 'OIIE', iata: 'IKA', name: 'امام خمینی', city: 'تهران' },
  { icao: 'OIMM', iata: 'MHD', name: 'مشهد', city: 'مشهد' },
  { icao: 'OISS', iata: 'SYZ', name: 'شیراز', city: 'شیراز' },
  { icao: 'OIFM', iata: 'IFN', name: 'اصفهان', city: 'اصفهان' },
  { icao: 'OITT', iata: 'TBZ', name: 'تبریز', city: 'تبریز' },
  { icao: 'OIAW', iata: 'AWZ', name: 'اهواز', city: 'اهواز' },
]

export async function GET() {
  const now = Math.floor(Date.now() / 1000)
  const twelveHoursAgo = now - 43200

  const results = await Promise.allSettled(
    AIRPORTS.map(async (airport) => {
      const url = `https://opensky-network.org/api/flights/departure?airport=${airport.icao}&begin=${twelveHoursAgo}&end=${now}`
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        // Cache each OpenSky response for 5 minutes
        next: { revalidate: 300 },
      })
      if (!res.ok) throw new Error(`OpenSky ${res.status}`)
      const flights = await res.json()
      const list = Array.isArray(flights) ? flights : []

      // Separate international from domestic (IranAir domestic callsigns start with IRA/EP-)
      const international = list.filter(f =>
        f.estArrivalAirport && !f.estArrivalAirport.startsWith('OI')
      )

      return {
        ...airport,
        status: international.length > 0 ? 'active' : list.length > 0 ? 'domestic' : 'quiet',
        intlCount: international.length,
        totalCount: list.length,
        destinations: [...new Set(
          international.slice(0, 4).map(f => f.estArrivalAirport).filter(Boolean)
        )],
      }
    })
  )

  const airports = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...AIRPORTS[i], status: 'unknown', intlCount: 0, totalCount: 0, destinations: [] }
  )

  return Response.json(
    { airports, fetchedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }
  )
}
