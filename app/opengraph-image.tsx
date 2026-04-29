import { ImageResponse } from 'next/og'

export const alt = 'Inambebar — Send anything home with the people you trust'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A2744',
          position: 'relative',
          gap: '28px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1.5px, transparent 1.5px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Amber glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 700px 400px at 600px 280px, rgba(224,123,41,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Icon mark — simplified suitcase + wings in pure divs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0px', position: 'relative', marginBottom: '8px' }}>
          {/* Left wing */}
          <div style={{
            width: 48, height: 72,
            background: 'linear-gradient(160deg, #E07B29 30%, rgba(224,123,41,0.3) 100%)',
            borderRadius: '60% 10% 10% 60%',
            transform: 'skewY(-8deg)',
            marginRight: '-12px',
            opacity: 0.9,
          }}/>
          {/* Suitcase body */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Handle */}
            <div style={{
              width: 36, height: 14,
              border: '4px solid white',
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
              marginBottom: '-1px',
            }}/>
            {/* Body */}
            <div style={{
              width: 88, height: 72,
              backgroundColor: 'white',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Amber stripe */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 5, backgroundColor: '#E07B29', opacity: 0.6 }}/>
            </div>
            {/* Wheels */}
            <div style={{ display: 'flex', gap: 40, marginTop: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white' }}/>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white' }}/>
            </div>
          </div>
          {/* Right wing */}
          <div style={{
            width: 48, height: 72,
            background: 'linear-gradient(200deg, #E07B29 30%, rgba(224,123,41,0.3) 100%)',
            borderRadius: '10% 60% 60% 10%',
            transform: 'skewY(8deg)',
            marginLeft: '-12px',
            opacity: 0.9,
          }}/>
        </div>

        {/* Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontSize: 88,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-3px',
            lineHeight: 1,
          }}>
            Inambebar
          </div>
          <div style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '1px',
          }}>
            اینم ببر
          </div>
        </div>

        {/* URL tagline */}
        <div style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          inambebar.com
        </div>

        {/* Amber bottom bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: '#E07B29',
        }}/>
      </div>
    ),
    { ...size }
  )
}
