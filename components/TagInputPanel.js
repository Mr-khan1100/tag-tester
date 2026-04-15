'use client';

import { useTester } from '@/components/TesterContext';
import { runTag } from '@/components/tagRunner';

const TAG_TYPES = [
  { id: 'standard',     label: 'Standard',     badgeClass: 'badge-standard'     },
  { id: 'vast',         label: 'VAST',         badgeClass: 'badge-vast'         },
  { id: 'native',       label: 'Native',       badgeClass: 'badge-native'       },
  { id: 'video',        label: 'Video',        badgeClass: 'badge-video'        },
  { id: 'audio',        label: 'Audio',        badgeClass: 'badge-audio'        },
  { id: 'interstitial', label: 'Interstitial', badgeClass: 'badge-interstitial' },
];

const PLACEHOLDERS = {
  standard:     '<a href="...">\n  <img src="..." width="300" height="250" />\n</a>',
  vast:         '<VAST version="2.0">...</VAST>',
  native:       '{"native":{"assets":[...],"link":{"url":"..."}}}',
  video:        '<VAST version="2.0">...</VAST>  or  https://cdn.example.com/ad.mp4',
  audio:        '<VAST version="2.0">...</VAST>  or  https://cdn.example.com/ad.mp3',
  interstitial: 'Paste any tag type — will render fullscreen based on device resolution',
};

export default function TagInputPanel() {
  const { state, dispatch, addLog } = useTester();

  const handleRun = async () => {
    if (!state.tagContent.trim()) return;
    dispatch({ type: 'SET_RUNNING', payload: true });
    dispatch({ type: 'CLEAR_LOGS' });
    addLog('Test started', '', '', 'info');
    await runTag({ state, dispatch, addLog });
    dispatch({ type: 'SET_RUNNING', payload: false });
  };

  const handleClear = () => {
    dispatch({ type: 'RESET' });
  };

  const currentType = TAG_TYPES.find((t) => t.id === state.tagType);

  return (
    <aside style={{
      width: 360,
      minWidth: 320,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Tag Type */}
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="label" style={{ marginBottom: 10 }}>Tag Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {TAG_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => dispatch({ type: 'SET_TAG_TYPE', payload: t.id })}
              style={{
                padding: '4px 11px',
                borderRadius: 7,
                border: `1px solid ${state.tagType === t.id ? 'var(--accent)' : 'var(--border)'}`,
                background: state.tagType === t.id ? 'var(--accent-dim)' : 'transparent',
                color: state.tagType === t.id ? 'var(--accent)' : 'var(--text2)',
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Input Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Tag Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="label">Tag / Payload</span>
            <span className={`badge ${currentType?.badgeClass}`}>{currentType?.label}</span>
          </div>
          <textarea
            value={state.tagContent}
            onChange={(e) => dispatch({ type: 'SET_TAG_CONTENT', payload: e.target.value })}
            placeholder={PLACEHOLDERS[state.tagType]}
            style={{
              width: '100%',
              minHeight: 190,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontFamily: 'var(--mono)',
              fontSize: 11,
              lineHeight: 1.65,
              padding: '11px 13px',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Interstitial Resolution */}
        {state.tagType === 'interstitial' && (
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Required Device Resolution</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                value={state.reqWidth}
                onChange={(e) => dispatch({ type: 'SET_REQ_WIDTH', payload: e.target.value })}
                placeholder="Min W"
                style={inputStyle}
              />
              <span style={{ color: 'var(--text3)', fontSize: 15 }}>×</span>
              <input
                type="number"
                value={state.reqHeight}
                onChange={(e) => dispatch({ type: 'SET_REQ_HEIGHT', payload: e.target.value })}
                placeholder="Min H"
                style={inputStyle}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
              Current: {DEVICE_SIZE[state.device].w} × {DEVICE_SIZE[state.device].h}
            </div>
          </div>
        )}

        {/* Buttons */}
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={state.isRunning || !state.tagContent.trim()}
          style={{ opacity: state.isRunning || !state.tagContent.trim() ? 0.6 : 1 }}
        >
          {state.isRunning ? '⏳ Running…' : '▶ Run Tag Test'}
        </button>
        <button className="btn btn-ghost" onClick={handleClear}>✕ Clear All</button>

        {/* SEO-friendly hint text (hidden from UI but good for crawlers) */}
        <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6, marginTop: 4 }}>
          Supports Standard HTML, VAST 2.0/3.0, Native OpenRTB JSON, Video, Audio, and Interstitial ad tags.
        </p>
      </div>
    </aside>
  );
}

const inputStyle = {
  flex: 1,
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontFamily: 'var(--mono)',
  fontSize: 13,
  padding: '8px 11px',
  outline: 'none',
};

export const DEVICE_SIZE = {
  desktop: { w: 960, h: 540  },
  tablet:  { w: 768, h: 1024 },
  mobile:  { w: 375, h: 667  },
};
