import TesterApp from '@/components/TesterApp';

export default function Home() {
  return (
    <>
      {/* Semantic SEO content — visually hidden but crawlable */}
      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        Ad Tag Tester – Free Online VAST, Native & Banner Creative Testing Tool
      </h1>

      {/* Main interactive app */}
      <TesterApp />

      {/* SEO footer content (visible at bottom) */}
      <section
        aria-label="About Ad Tag Tester Pro"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          height: 0,
        }}
      >
        <p>
          Ad Tag Tester Pro is a free online tool to test and debug advertising creative tags including
          VAST 2.0 and 3.0 video tags, OpenRTB Native JSON ads, standard HTML banner tags,
          video ad tags, audio VAST tags, and interstitial creatives.
        </p>
        <p>
          Test your ad creatives across desktop, tablet, and mobile device simulations with
          real-time HTTP event logs showing impression pixels, click URLs, VAST tracking events,
          and HTTP response codes.
        </p>
      </section>
    </>
  );
}
