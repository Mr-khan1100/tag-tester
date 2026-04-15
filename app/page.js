import TesterApp from '@/components/TesterApp';

export default function Home() {
  return (
    <>
      {/* Visible crawlable heading content */}
      <h1
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px 18px',
          fontSize: 'clamp(2.4rem, 6vw, 4.6rem)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }}
      >
        Ad Tag Tester – Free Online VAST, Native & Banner Creative Testing Tool
      </h1>
      <p
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 28px',
          color: 'var(--text2)',
          fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
          lineHeight: 1.7,
        }}
      >
        Free online ad tag tester for previewing creatives, validating trackers, and debugging
        delivery issues with real-time HTTP event logs across desktop, tablet, and mobile layouts.
      </p>

      {/* Main interactive app */}
      <TesterApp />

      {/* Supporting landing-page copy */}
      <section
        aria-label="About Ad Tag Tester Pro"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '56px 24px 80px',
          lineHeight: 1.7,
          color: 'var(--text2)',
        }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: 14, color: 'var(--text)' }}>
          What this tool supports
        </h2>
        <p>
          Ad Tag Tester Pro is a free online tool to test and debug advertising creative tags including
          VAST 2.0 and 3.0 video tags, OpenRTB Native JSON ads, standard HTML banner tags,
          video ad tags, audio VAST tags, and interstitial creatives.
        </p>
        <p style={{ marginTop: 16 }}>
          Test your ad creatives across desktop, tablet, and mobile device simulations with
          real-time HTTP event logs showing impression pixels, click URLs, VAST tracking events,
          and HTTP response codes.
        </p>
        <p style={{ marginTop: 16 }}>
          This is useful for ad ops teams, QA engineers, publishers, and developers who want to
          verify that tags render correctly before campaigns go live.
        </p>
      </section>
    </>
  );
}
