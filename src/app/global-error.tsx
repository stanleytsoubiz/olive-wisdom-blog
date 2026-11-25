'use client';

// Root-level fallback: renders when the root layout itself fails, so it
// cannot rely on the site's CSS or components — everything is inline.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-Hant">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f7f2',
          fontFamily: 'Georgia, "Times New Roman", serif',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '480px', textAlign: 'center' }}>
          <p
            style={{
              color: '#a07d2c',
              fontSize: '14px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            發生錯誤
          </p>
          <h1 style={{ fontSize: '56px', color: '#3d4a1e', margin: '0 0 16px' }}>500</h1>
          <p style={{ fontSize: '20px', color: '#555', marginBottom: '12px' }}>
            橄欖園裡起了點小風波…
          </p>
          <p style={{ color: '#777', lineHeight: 1.7, marginBottom: '32px' }}>
            網站發生未預期的錯誤，請重新載入頁面。
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#556b2f',
              color: '#fff',
              fontWeight: 600,
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            重新載入
          </button>
        </div>
      </body>
    </html>
  );
}
