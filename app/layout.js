import './globals.css';

const SITE_URL = 'https://adtagtester.netlify.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ad Tag Tester – Free Online VAST, Native & Banner Creative Tester',
    template: '%s | Ad Tag Tester Pro',
  },
  icons: {
    icon: '/favicon.svg',
  },
  description:
    'Free online ad tag tester. Instantly test VAST, native, banner, video, audio & interstitial ad creatives. Debug tags with real-time HTTP event logs. No signup required.',
  keywords: [
    'ad tag tester',
    'creative tester',
    'VAST tester',
    'VAST tag validator',
    'banner ad tester',
    'native ad tester',
    'video ad tester',
    'audio ad tester',
    'interstitial ad tester',
    'programmatic creative tester',
    'display ad debugger',
    'ad tag debugger',
    'online ad tester',
    'free ad tag tool',
    'HTML ad tag tester',
    'ad creative validator',
  ],
  authors: [{ name: 'AdTag Tester Pro', url: SITE_URL }],
  creator: 'AdTag Tester Pro',
  publisher: 'AdTag Tester Pro',
  category: 'technology',
  classification: 'Advertising Technology Tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Ad Tag Tester Pro',
    title: 'Ad Tag Tester – Free Online VAST, Native & Banner Creative Tester',
    description:
      'Test VAST, native, banner, video, audio & interstitial ad creatives instantly. Real-time HTTP event logs. Free, no signup.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ad Tag Tester Pro – Free Online Creative Testing Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ad Tag Tester Pro – Free VAST & Creative Tester',
    description:
      'Debug VAST, native, banner, video & interstitial ad tags with real-time event logs. Free online tool.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'your-google-site-verification-token',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Ad Tag Tester Pro',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  url: SITE_URL,
  description:
    'Free online ad tag tester. Test VAST, native, banner, video, audio and interstitial ad creatives with real-time HTTP event logs.',
  featureList: [
    'VAST 2.0 / 3.0 tag testing',
    'Native JSON ad testing',
    'Standard HTML banner testing',
    'Video ad tag testing',
    'Audio VAST tag testing',
    'Interstitial ad testing',
    'Real-time HTTP event log',
    'Device simulation (desktop, tablet, mobile)',
    'Screen rotation simulation',
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  author: {
    '@type': 'Organization',
    name: 'AdTag Tester Pro',
    url: SITE_URL,
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an ad tag tester?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An ad tag tester is a tool that lets you preview and debug advertising tags — including VAST video tags, native JSON ads, HTML banner tags, and interstitial creatives — before deploying them in live campaigns.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ad tag formats does this tool support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ad Tag Tester Pro supports Standard HTML banners, VAST 2.0/3.0 video tags, Native JSON ads (OpenRTB), Video ad tags, Audio VAST tags, and Interstitial creatives with device/resolution targeting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this ad tag tester free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Ad Tag Tester Pro is completely free to use with no account or signup required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I test VAST tags online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Paste your VAST XML tag into the tool, select the VAST tag type, and click Run Test. The tool will parse the VAST, fire impression trackers, and log all events with HTTP status codes in real time.',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
