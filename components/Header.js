'use client';

import { useTester } from '@/components/TesterContext';

const DEVICES = [
  { id: 'desktop', icon: '🖥', label: 'Desktop' },
  { id: 'tablet',  icon: '📱', label: 'Tablet'  },
  { id: 'mobile',  icon: '📲', label: 'Mobile'  },
];

export default function Header() {
  const { state, dispatch } = useTester();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17,
        }}>⚡</div>
        <div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 17, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            Ad<span style={{ color: 'var(--accent)' }}>Tag</span> Tester Pro
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Free Online Creative Tester
          </div>
        </div>
      </div>

      {/* Device Selector */}
      <div style={{
        display: 'flex',
        gap: 4,
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: 11,
        padding: 4,
      }}>
        {DEVICES.map((d) => (
          <button
            key={d.id}
            onClick={() => dispatch({ type: 'SET_DEVICE', payload: d.id })}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: state.device === d.id ? 'var(--accent)' : 'transparent',
              color: state.device === d.id ? '#000' : 'var(--text2)',
              fontFamily: 'var(--sans)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            <span>{d.icon}</span>
            <span>{d.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
