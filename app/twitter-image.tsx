import { ImageResponse } from 'next/og'

export const alt = 'Inambebar — Send anything home with the people you trust'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Twitter uses the same OG image — re-export from opengraph-image
export { default } from './opengraph-image'
