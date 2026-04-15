'use client';

import { useTester } from '@/components/TesterContext';
import AdDisplay from '@/components/AdDisplay';

const DEVICE_CONFIG = {
  desktop: { label: '🖥 Desktop', w: 960, h: 540, maxW: '100%', borderRadius: 14 },
  tablet:  { label: '📱 Tablet',  w: 768, h: 1024, maxW: 768,   borderRadius: 20 },
  mobile:  { label: '📲 Mobile',  w: 375, h: 667,  maxW: 375,   borderRadius: 28 },
};

export default function DevicePreview() {
  const { state, dispatch } = useTester();
  const cfg = DEVICE_CONFIG[state.device];
  const isMobile = state.device === 'mobile';

  const frameW = state.rotated ? cfg.h : cfg.w;
  const frameH = state.rotated ? cfg.w : cfg.h;
  const frameMax = state.rotated ? '90vw' : (cfg.maxW === '100%' ? '100%' : `${cfg.maxW}px`);

  const clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusDot active={!!state.adContent} />
          Preview
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
            {state.rotated
              ? `${frameW} × ${frameH} (landscape)`
              : `${cfg.w} × ${cfg.h}`}
          </span>
          {/* Rotate — only for mobile */}
          {isMobile && (
            <button
              onClick={() => dispatch({ type: 'TOGGLE_ROTATE' })}
              title="Rotate screen"
              style={{
                background: state.rotated ? 'var(--accent-dim)' : 'var(--surface2)',
                border: `1px solid ${state.rotated ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 7,
                color: state.rotated ? 'var(--accent)' : 'var(--text2)',
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.18s',
              }}
            >
              <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: state.rotated ? 'rotate(90deg)' : 'none' }}>⟳</span>
              {state.rotated ? 'Landscape' : 'Portrait'}
            </button>
          )}
        </div>
      </div>

      {/* Device Frame Scroll Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '28px 20px',
      }}>
        <div style={{
          width: frameMax,
          maxWidth: `${frameW}px`,
          minHeight: `${Math.min(frameH, 560)}px`,
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: cfg.borderRadius,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Status Bar */}
          <div style={{
            height: 30,
            background: 'var(--surface2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            fontSize: 10,
            fontFamily: 'var(--mono)',
            color: 'var(--text3)',
            flexShrink: 0,
          }}>
            <span>{cfg.label}</span>
            <span>{frameW} × {frameH}</span>
            <span>{clock}</span>
          </div>

          {/* Ad Area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <AdDisplay />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ active }) {
  return (
    <span style={{
      width: 7, height: 7,
      borderRadius: '50%',
      background: active ? 'var(--accent3)' : 'var(--text3)',
      display: 'inline-block',
      boxShadow: active ? '0 0 0 2px rgba(16,185,129,0.3)' : 'none',
      animation: active ? 'pulse 2s infinite' : 'none',
    }} />
  );
}
