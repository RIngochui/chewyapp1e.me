import { useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

const BOOKMARKS = [
  { label: '🏎️ Self Driving Car School Project', url: 'https://www.youtube.com/watch?v=nwk44ECAk_A&list=RDAq5WXmQQooo&start_radio=1' },
];

// Sites that support embedding or have mobile-friendly iframes
const EMBED_OVERRIDES: Record<string, (url: string) => string | null> = {
  'youtube.com': convertYouTube,
  'youtu.be': convertYouTubeShort,
};

function convertYouTube(url: string): string | null {
  // youtube.com/watch?v=ID or youtube.com/shorts/ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  const liveMatch = url.match(/\/live\/([a-zA-Z0-9_-]{11})/);
  const id = (watchMatch || shortsMatch || liveMatch)?.[1];
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  // Just the homepage — embed the front page via nocookie
  return 'https://www.youtube-nocookie.com/embed?listType=search&list=youtube';
}

function convertYouTubeShort(url: string): string | null {
  const id = url.split('/').pop()?.split('?')[0];
  if (id && id.length === 11) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  return null;
}

function getEmbedUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const hostname = parsed.hostname.replace('www.', '');
    const converter = EMBED_OVERRIDES[hostname];
    if (converter) {
      const embedUrl = converter(rawUrl);
      if (embedUrl) return embedUrl;
    }
  } catch {
    // not a valid URL, use as-is
  }
  return rawUrl;
}

type PageState = 'blank' | 'loading' | 'loaded' | 'blocked';

export default function BrowserWindow() {
  const { bg, bgChrome: chrome, bgMuted } = useTheme();
  const [iframeSrc, setIframeSrc] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [displayUrl, setDisplayUrl] = useState('');
  const [pageState, setPageState] = useState<PageState>('blank');
  const [isYouTube, setIsYouTube] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (target: string) => {
    const trimmed = target.trim();
    if (!trimmed) return;
    const full = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const embedUrl = getEmbedUrl(full);
    const ytHostname = full.includes('youtube.com') || full.includes('youtu.be');

    setIsYouTube(ytHostname);
    setDisplayUrl(full);
    setInputUrl(full);
    setIframeSrc(embedUrl);
    setPageState('loading');

    // Most iframe-blocking sites will error quickly; we assume loaded after timeout
    // For YouTube embeds we know it works
    setTimeout(() => {
      setPageState(prev => (prev === 'loading' ? 'loaded' : prev));
    }, 2500);
  };

  const handleIframeLoad = () => {
    // If load fires, the page embedded OK
    if (pageState === 'loading') setPageState('loaded');
  };

  const handleIframeError = () => {
    setPageState('blocked');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: 8 }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '4px',
          background: chrome,
          borderBottom: '1px solid #808080',
          flexShrink: 0,
          alignItems: 'center',
        }}
      >
        <button className="btn-98" style={{ fontSize: 7 }}>◀</button>
        <button className="btn-98" style={{ fontSize: 7 }}>▶</button>
        <button
          className="btn-98"
          style={{ fontSize: 7 }}
          onClick={() => iframeSrc && navigate(displayUrl)}
        >
          🔄
        </button>
        <div
          className="inset-98"
          style={{ flex: 1, padding: '2px 4px', display: 'flex', alignItems: 'center' }}
        >
          <input
            className="input-98"
            style={{ fontSize: 7 }}
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(inputUrl)}
            placeholder="Enter URL..."
          />
        </div>
        <button
          className="btn-98"
          style={{ fontSize: 7 }}
          onClick={() => navigate(inputUrl)}
        >
          GO
        </button>
      </div>

      {/* Bookmarks */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '2px 4px',
          background: bgMuted,
          borderBottom: '1px solid #c0c0c0',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        {BOOKMARKS.map(b => (
          <button
            key={b.label}
            className="btn-98"
            style={{ fontSize: 7 }}
            onClick={() => navigate(b.url)}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: bg }}>
        {/* Blank home */}
        {pageState === 'blank' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 8,
              color: '#808080',
            }}
          >
            <img src="/desktop_icons/apple_browser.png" alt="Apple Browser" style={{ width: 48, height: 48, imageRendering: 'pixelated' }} />
            <div>Apple Browser v1.0</div>
            <div style={{ fontSize: 7 }}>Founded in HK · Built in Toronto</div>
            <div style={{ fontSize: 7 }}>Enter a URL to start browsing</div>
          </div>
        )}

        {/* Loading spinner */}
        {pageState === 'loading' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <img src="/desktop_icons/apple_browser.png" alt="" style={{ width: 24, height: 24, imageRendering: 'pixelated' }} />
            <span>Loading...</span>
            <span style={{ fontSize: 7, color: '#808080' }}>{displayUrl}</span>
          </div>
        )}

        {/* Blocked / can't embed */}
        {pageState === 'blocked' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              flexDirection: 'column',
              gap: 10,
              padding: 16,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 28 }}>🚫</span>
            <div>此網頁拒絕嵌入</div>
            <div style={{ fontSize: 7, color: '#808080' }}>
              This site blocked Apple Browser (X-Frame-Options)
            </div>
            <div style={{ fontSize: 7, color: '#808080', marginTop: 4 }}>
              Most sites block iframe embedding
            </div>
            <button
              className="btn-98"
              style={{ marginTop: 8 }}
              onClick={() => window.open(displayUrl, '_blank')}
            >
              🔗 Open in Real Browser
            </button>
          </div>
        )}

        {/* The iframe — always rendered when we have a src so load fires */}
        {iframeSrc && (
          <iframe
            key={iframeSrc}
            ref={iframeRef}
            src={iframeSrc}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              // hide while loading/blocked
              opacity: pageState === 'loaded' ? 1 : 0,
              pointerEvents: pageState === 'loaded' ? 'auto' : 'none',
            }}
            title="龍Browser"
            allow="autoplay; fullscreen"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>

      {/* Status bar */}
      <div
        style={{
          background: chrome,
          borderTop: '1px solid #808080',
          padding: '2px 6px',
          fontSize: 7,
          color: '#404040',
          flexShrink: 0,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span>
          {pageState === 'blank' && 'Ready'}
          {pageState === 'loading' && '🟡 Connecting...'}
          {pageState === 'loaded' && `🟢 Loaded ${displayUrl}`}
          {pageState === 'blocked' && '🔴 Blocked'}
        </span>
        {isYouTube && pageState === 'loaded' && (
          <span style={{ color: '#cc0000' }}>▶ YouTube Mode</span>
        )}
      </div>
    </div>
  );
}
