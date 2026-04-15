'use client';

import { TesterProvider } from '@/components/TesterContext';
import Header from '@/components/Header';
import TagInputPanel from '@/components/TagInputPanel';
import DevicePreview from '@/components/DevicePreview';
import EventLog from '@/components/EventLog';
import AdMobSidebar from '@/components/AdMobSidebar';

export default function TesterApp() {
  return (
    <TesterProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <Header />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Tag Input */}
          <TagInputPanel />

          {/* Center: Preview + Log stacked */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <DevicePreview />
            <EventLog />
          </main>

          {/* Right: AdMob */}
          {/* <AdMobSidebar /> */}
        </div>
      </div>
    </TesterProvider>
  );
}
