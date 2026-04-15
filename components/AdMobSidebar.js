'use client';

const SLOTS = [
  { icon: '📢', label: 'Banner',       size: '320 × 50',  h: 70  },
  { icon: '🖼',  label: 'Medium Rect', size: '300 × 250', h: 160 },
  { icon: '📺', label: 'Interstitial', size: 'Full Screen', h: 160 },
  { icon: '🎁', label: 'Rewarded',    size: 'Video',     h: 120 },
  { icon: '🏷', label: 'App Open',    size: 'Full Screen', h: 100 },
];

export default function AdMobSidebar() {
  return (
    <aside style={{
      width: 168,
      minWidth: 150,
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 8px',
      gap: 12,
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      <div style={{
        width: '100%',
        paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
        fontSize: 9,
        fontFamily: 'var(--mono)',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--text3)',
      }}>AdMob Slots</div>

      {SLOTS.map((slot) => (
        <div
          key={slot.label}
          style={{
            width: '100%',
            height: slot.h,
            background: 'var(--surface2)',
            border: '1px dashed var(--border)',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            cursor: 'default',
            transition: 'border-color 0.2s',
            padding: '8px 6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent2)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <span style={{ fontSize: 20, opacity: 0.55 }}>{slot.icon}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--sans)', fontWeight: 700, color: 'var(--text3)', textAlign: 'center' }}>{slot.label}</span>
          <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', opacity: 0.7 }}>{slot.size}</span>
        </div>
      ))}

      <div style={{
        marginTop: 'auto',
        fontSize: 9,
        color: 'var(--text3)',
        textAlign: 'center',
        lineHeight: 1.6,
        fontFamily: 'var(--mono)',
        padding: '8px 4px',
        borderTop: '1px solid var(--border)',
        width: '100%',
      }}>
        AdMob slots are reserved for your monetization placements and are isolated from tag tests.
      </div>
    </aside>
  );
}
