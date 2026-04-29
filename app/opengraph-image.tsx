import { ImageResponse } from 'next/og'

export const alt = 'Inambebar — Send anything home with the people you trust'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#1A2744',
          gap: 20,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Suitcase mark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Left wing */}
          <div style={{
            width: 52, height: 80,
            background: 'linear-gradient(155deg, #E07B29 20%, rgba(224,123,41,0.25) 100%)',
            borderRadius: '60% 10% 10% 60%',
            marginRight: -14,
          }}/>
          {/* Suitcase */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 38, height: 13,
              border: '4px solid #FFFFFF',
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
            }}/>
            <div style={{
              width: 96, height: 78,
              background: '#FFFFFF',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '100%', height: 5, background: 'rgba(224,123,41,0.5)' }}/>
            </div>
            <div style={{ display: 'flex', gap: 44, marginTop: 7 }}>
              <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#FFFFFF' }}/>
              <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#FFFFFF' }}/>
            </div>
          </div>
          {/* Right wing */}
          <div style={{
            width: 52, height: 80,
            background: 'linear-gradient(205deg, #E07B29 20%, rgba(224,123,41,0.25) 100%)',
            borderRadius: '10% 60% 60% 10%',
            marginLeft: -14,
          }}/>
        </div>

        {/* Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 86, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-3.5px', lineHeight: 1 }}>
            Inambebar
          </div>
          <div style={{ fontSize: 30, color: '#E07B29' }}>
            اینم ببر
          </div>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Send anything home — with the people you trust
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['✈  Iranian diaspora', '🔒  Trusted travelers', '🎁  Free to join'].map(b => (
            <div key={b} style={{
              display: 'flex',
              padding: '9px 22px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 100,
              fontSize: 18, color: 'rgba(255,255,255,0.65)',
            }}>
              {b}
            </div>
          ))}
        </div>

        {/* Domain — centered at bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute' as const,
          bottom: 22,
          left: 0, right: 0,
          fontSize: 18, color: 'rgba(255,255,255,0.25)',
          letterSpacing: 3,
        }}>
          inambebar.com
        </div>
        <div style={{
          display: 'flex',
          position: 'absolute' as const,
          bottom: 0, left: 0, right: 0,
          height: 8, background: '#E07B29',
        }}/>
      </div>
    ),
    { ...size }
  )
}
