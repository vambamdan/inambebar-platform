import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#1A2744',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Wings + suitcase row */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 36, height: 56,
            background: 'linear-gradient(155deg, #E07B29 20%, rgba(224,123,41,0.3) 100%)',
            borderRadius: '60% 10% 10% 60%',
            marginRight: -10,
          }}/>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 28, height: 10, border: '3px solid #FFFFFF', borderBottom: 'none', borderRadius: '5px 5px 0 0' }}/>
            <div style={{
              width: 68, height: 55, background: '#FFFFFF', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '100%', height: 4, background: 'rgba(224,123,41,0.5)' }}/>
            </div>
            <div style={{ display: 'flex', gap: 30, marginTop: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFFFFF' }}/>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFFFFF' }}/>
            </div>
          </div>
          <div style={{
            width: 36, height: 56,
            background: 'linear-gradient(205deg, #E07B29 20%, rgba(224,123,41,0.3) 100%)',
            borderRadius: '10% 60% 60% 10%',
            marginLeft: -10,
          }}/>
        </div>
      </div>
    ),
    { ...size }
  )
}
