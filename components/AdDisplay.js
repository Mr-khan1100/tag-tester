'use client';

import { useTester } from '@/components/TesterContext';
import { runVAST } from '@/components/tagRunner';
import { parseVAST, parseNative } from '@/lib/tagUtils';

export default function AdDisplay() {
  const { state, dispatch, addLog } = useTester();
  const { adContent } = state;

  if (!adContent) {
    return (
      <div className="ad-area">
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__title">No Tag Loaded</div>
          <div className="empty-state__sub">Paste a tag and click Run Tag Test</div>
        </div>
      </div>
    );
  }

  return <AdRenderer content={adContent} dispatch={dispatch} addLog={addLog} />;
}

function AdRenderer({ content, dispatch, addLog }) {
  const { type } = content;

  if (type === 'error') {
    return (
      <div className="ad-area">
        <div className="vast-info">
          <div className="vast-info__icon">⚠️</div>
          <div className="vast-info__title" style={{ color: 'var(--error)' }}>Parse Error</div>
          <div className="vast-info__sub" style={{ marginTop: 8, maxWidth: 360, wordBreak: 'break-all' }}>{content.message}</div>
        </div>
      </div>
    );
  }

  if (type === 'standard') {
    return (
      <div className="ad-area">
        <div
          dangerouslySetInnerHTML={{ __html: content.html }}
          onClick={(e) => {
            const anchor = e.target.closest('a');
            if (anchor) {
              e.preventDefault();
              const href = anchor.href || anchor.getAttribute('href') || '';
              addLog('Click: anchor', href, '—', 'click');
              // Fire the click tracker in no-cors mode so we log the actual HTTP response
              if (href.startsWith('http')) {
                fetch(href, { method: 'GET', mode: 'no-cors', cache: 'no-cache' })
                  .then(() => addLog('Click: fired ✓', href, 'fired', 'click'))
                  .catch((err) => addLog('Click: error ' + err.message, href, 'NET_ERR', 'error'));
              }
            }
          }}
          style={{ maxWidth: '100%', cursor: 'pointer' }}
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="ad-area">
        <video
          src={content.src}
          controls
          onPlay={() => addLog('Video: play', content.src, '', 'start')}
          onEnded={() => addLog('Video: complete', content.src, '', 'complete')}
          onError={() => addLog('Video: load error', content.src, '500', 'error')}
        />
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className="ad-area" style={{ flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>🔊</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>Audio Ad</div>
        <audio
          src={content.src}
          controls
          autoPlay
          onPlay={() => addLog('Audio: play', content.src, '', 'start')}
          onEnded={() => addLog('Audio: complete', content.src, '', 'complete')}
          onError={() => addLog('Audio: load error', content.src, '500', 'error')}
        />
      </div>
    );
  }

  if (type === 'vast-wrapper') {
    return (
      <div className="ad-area">
        <div className="vast-info">
          <div className="vast-info__icon">🔄</div>
          <div className="vast-info__title">VAST Wrapper</div>
          <div className="vast-info__sub">Inner VAST fetched via no-cors request.<br />See event log for details.</div>
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 8, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', wordBreak: 'break-all', maxWidth: 400, textAlign: 'left' }}>
            {content.vastUri}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'vast-tracking-only') {
    return (
      <div className="ad-area">
        <div className="vast-info">
          <div className="vast-info__icon">📡</div>
          <div className="vast-info__title">Tracking-Only VAST</div>
          <div className="vast-info__sub">All tracking events fired. No media file in VAST response.</div>
        </div>
      </div>
    );
  }

  if (type === 'native') {
    return (
      <div className="ad-area">
        <NativeCard data={content} addLog={addLog} />
      </div>
    );
  }

  if (type === 'interstitial-blocked') {
    return (
      <div className="ad-area">
        <div className="vast-info">
          <div className="vast-info__icon">⛔</div>
          <div className="vast-info__title" style={{ color: 'var(--warn)' }}>Device Not Eligible</div>
          <div className="vast-info__sub">
            Current: {content.size.w}×{content.size.h}<br />
            Required: ≥{content.reqW}×{content.reqH}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'interstitial') {
    return (
      <InterstitialOverlay content={content} dispatch={dispatch} addLog={addLog} />
    );
  }

  if (type === 'dismissed') {
    return (
      <div className="ad-area">
        <div className="empty-state">
          <div className="empty-state__icon">✓</div>
          <div className="empty-state__title" style={{ color: 'var(--accent3)' }}>Interstitial Dismissed</div>
        </div>
      </div>
    );
  }

  return null;
}

function NativeCard({ data, addLog }) {
  return (
    <div
      className="native-card"
      onClick={() => addLog('Native click', data.clickUrl, '200', 'click')}
    >
      {data.heroUrl && (
        <img
          className="native-card__hero"
          src={data.heroUrl}
          alt={data.title}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="native-card__body">
        <div className="native-card__icon-row">
          {data.iconUrl && (
            <img
              className="native-card__icon"
              src={data.iconUrl}
              alt=""
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div className="native-card__title">{data.title}</div>
        </div>
        {data.desc && <div className="native-card__desc">{data.desc}</div>}
        <div className="native-card__cta">{data.cta}</div>
      </div>
    </div>
  );
}

function InterstitialOverlay({ content, dispatch, addLog }) {
  const handleClose = () => {
    addLog('Interstitial dismissed', '', '', 'info');
    dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'dismissed' } });
  };

  let innerEl = null;
  if (content.innerType === 'native') {
    const parsed = parseNative(content.innerTag);
    if (!parsed.error) {
      innerEl = <NativeCard data={parsed} addLog={addLog} />;
    }
  } else if (content.innerType === 'vast') {
    innerEl = (
      <div className="vast-info" style={{ color: 'white' }}>
        <div className="vast-info__icon">📺</div>
        <div className="vast-info__title">VAST Interstitial</div>
        <div className="vast-info__sub">Tag fired. See log for events.</div>
      </div>
    );
  } else {
    innerEl = (
      <div
        dangerouslySetInnerHTML={{ __html: content.innerTag }}
        style={{ maxWidth: '100%' }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: '30px 0 0 0',
        background: 'rgba(0,0,0,0.9)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button className="interstitial-close" onClick={handleClose}>✕</button>
      {innerEl}
    </div>
  );
}
