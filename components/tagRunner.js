'use client';

import { parseVAST, parseNative, extractUrlsFromHTML, fireTracker } from '@/lib/tagUtils';
import { DEVICE_SIZE } from '@/components/TagInputPanel';

/* ─────────────────────────────────────────────────
 * NETWORK INTERCEPTOR
 * Monkey-patches fetch + XHR so every request made
 * by rendered creative HTML/JS is captured into the log.
 * Call startNetworkInterception(addLog) before rendering,
 * stopNetworkInterception() to restore originals.
 * ───────────────────────────────────────────────── */
let _origFetch = null;
let _origXHROpen = null;
let _origXHRSend = null;
let _perfObserver = null;
let _addLogRef = null;

export function startNetworkInterception(addLog) {
  _addLogRef = addLog;

  // 1. Patch fetch
  if (!_origFetch) _origFetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : input?.url || String(input);
    _addLogRef('Network: fetch →', url, 'pending', 'request');
    try {
      const res = await _origFetch.call(this, input, init);
      const code = res.status === 0 ? 'fired' : String(res.status);
      _addLogRef('Network: fetch ✓', url, code, res.ok || res.status === 0 ? 'impression' : 'error');
      return res;
    } catch (e) {
      _addLogRef('Network: fetch ✗ ' + e.message, url, 'NET_ERR', 'error');
      throw e;
    }
  };

  // 2. Patch XMLHttpRequest
  if (!_origXHROpen) _origXHROpen = XMLHttpRequest.prototype.open;
  if (!_origXHRSend) _origXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._interceptedUrl = String(url);
    this._interceptedMethod = method;
    return _origXHROpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    const url = this._interceptedUrl || '';
    _addLogRef(`Network: XHR ${this._interceptedMethod || 'GET'} →`, url, 'pending', 'request');
    this.addEventListener('load', () => {
      _addLogRef(
        `Network: XHR ✓`,
        url,
        String(this.status),
        this.status >= 200 && this.status < 400 ? 'impression' : 'error'
      );
    });
    this.addEventListener('error', () => {
      _addLogRef('Network: XHR ✗', url, 'NET_ERR', 'error');
    });
    return _origXHRSend.call(this, ...args);
  };

  // 3. PerformanceObserver — catches img/script/iframe sub-resources
  try {
    _perfObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const url = entry.name;
        // Skip non-http, and skip our own Next.js assets
        if (!url.startsWith('http') || url.includes('localhost:300') || url.includes('/_next/')) return;
        const code = entry.responseStatus ? String(entry.responseStatus) : 'loaded';
        _addLogRef('Network: resource', url, code, 'impression');
      });
    });
    _perfObserver.observe({ type: 'resource', buffered: false });
  } catch (_) {}
}

export function stopNetworkInterception() {
  if (_origFetch) { window.fetch = _origFetch; _origFetch = null; }
  if (_origXHROpen) { XMLHttpRequest.prototype.open = _origXHROpen; _origXHROpen = null; }
  if (_origXHRSend) { XMLHttpRequest.prototype.send = _origXHRSend; _origXHRSend = null; }
  if (_perfObserver) { _perfObserver.disconnect(); _perfObserver = null; }
  _addLogRef = null;
}

/**
 * Central tag test runner.
 * Dispatches adContent and logs via context actions.
 */
export async function runTag({ state, dispatch, addLog }) {
  const { tagType, tagContent, device, reqWidth, reqHeight } = state;
  const size = DEVICE_SIZE[device];

  // Start intercepting ALL network activity from the creative
  startNetworkInterception(addLog);

  try {
    switch (tagType) {
      case 'standard':
        await runStandard(tagContent, dispatch, addLog);
        break;
      case 'vast':
        await runVAST(tagContent, dispatch, addLog, false);
        break;
      case 'native':
        await runNative(tagContent, dispatch, addLog);
        break;
      case 'video':
        await runVideo(tagContent, dispatch, addLog);
        break;
      case 'audio':
        await runAudio(tagContent, dispatch, addLog);
        break;
      case 'interstitial':
        await runInterstitial(tagContent, dispatch, addLog, size, reqWidth, reqHeight);
        break;
      default:
        addLog('Unknown tag type', '', '', 'error');
    }
  } finally {
    // Keep observer running for a few seconds to catch deferred loads,
    // then clean up fetch/XHR patches (PerformanceObserver stays longer)
    setTimeout(() => stopNetworkInterception(), 8000);
  }
}

/* ── STANDARD HTML ── */
async function runStandard(tag, dispatch, addLog) {
  addLog('Parsing standard HTML tag…', '', '', 'info');
  const urls = extractUrlsFromHTML(tag);

  if (urls.impression) {
    addLog('Impression pixel detected', urls.impression, 'pending', 'impression');
    const code = await fireTracker(urls.impression);
    addLog('Impression pixel fired', urls.impression, code, 'impression');
  }
  if (urls.click) {
    addLog('Click URL detected', urls.click, '—', 'click');
  }

  dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'standard', html: tag, clickUrl: urls.click } });
}

/* ── VAST ── */
export async function runVAST(tag, dispatch, addLog, audioOnly) {
  addLog('Parsing VAST XML…', '', '', 'info');
  const parsed = parseVAST(tag);

  if (parsed.error) {
    addLog('VAST parse error: ' + parsed.error, '', '500', 'error');
    dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'error', message: parsed.error } });
    return;
  }

  addLog(`VAST v${parsed.version} parsed`, '', '200', 'info');

  if (parsed.impression) {
    addLog('VAST Impression – firing', parsed.impression, 'pending', 'impression');
    const code = await fireTracker(parsed.impression);
    addLog('VAST Impression – done', parsed.impression, code, 'impression');
  }

  if (parsed.vastUri) {
    addLog('Wrapper VAST URI – firing', parsed.vastUri, 'pending', 'request');
    const code = await fireTracker(parsed.vastUri);
    addLog('Wrapper VAST URI – done', parsed.vastUri, code, 'request');
    dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'vast-wrapper', vastUri: parsed.vastUri } });
    return;
  }

  for (const t of parsed.trackings) {
    addLog(`VAST Tracking [${t.event}]`, t.url, '—', 'info');
  }

  if (parsed.clickThrough) {
    addLog('Click URL', parsed.clickThrough, '—', 'click');
  }

  if (parsed.mediaFiles.length) {
    const mf = parsed.mediaFiles[0];
    const type = audioOnly || mf.type.includes('audio') ? 'audio' : 'video';
    dispatch({ type: 'SET_AD_CONTENT', payload: { type, src: mf.url, mediaFiles: parsed.mediaFiles } });
    addLog(`Media loaded [${type}]`, mf.url, '—', type === 'audio' ? 'info' : 'start');
  } else {
    dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'vast-tracking-only' } });
    addLog('Tracking-only VAST — no media', '', '', 'info');
  }
}

/* ── NATIVE ── */
async function runNative(tag, dispatch, addLog) {
  addLog('Parsing native JSON…', '', '', 'info');
  const parsed = parseNative(tag);

  if (parsed.error) {
    addLog('Native parse error: ' + parsed.error, '', '500', 'error');
    dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'error', message: parsed.error } });
    return;
  }

  addLog('Native JSON parsed', '', '200', 'info');

  for (const tracker of parsed.impTrackers) {
    if (tracker.startsWith('http')) {
      addLog('Native Impression – firing', tracker, 'pending', 'impression');
      const code = await fireTracker(tracker);
      addLog('Native Impression – done', tracker, code, 'impression');
    } else {
      addLog('Native macro (unfired): ' + tracker.slice(0, 80), '', '—', 'info');
    }
  }

  dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'native', ...parsed } });
}

/* ── VIDEO ── */
async function runVideo(tag, dispatch, addLog) {
  const trimmed = tag.trim();
  if (trimmed.startsWith('<VAST') || trimmed.startsWith('<?xml')) {
    await runVAST(tag, dispatch, addLog, false);
    return;
  }
  addLog('Raw video URL loaded', trimmed, '—', 'info');
  dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'video', src: trimmed } });
}

/* ── AUDIO ── */
async function runAudio(tag, dispatch, addLog) {
  const trimmed = tag.trim();
  if (trimmed.startsWith('<VAST') || trimmed.startsWith('<?xml')) {
    await runVAST(tag, dispatch, addLog, true);
    return;
  }
  addLog('Audio URL loaded', trimmed, '—', 'info');
  dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'audio', src: trimmed } });
}

/* ── INTERSTITIAL ── */
async function runInterstitial(tag, dispatch, addLog, size, reqW, reqH) {
  addLog('Checking device eligibility…', '', '', 'info');
  addLog(`Device: ${size.w}×${size.h} — Required: ≥${reqW}×${reqH}`, '', '', 'info');

  const eligible = size.w >= reqW && size.h >= reqH;

  if (!eligible) {
    addLog('Device resolution check: FAILED', '', '403', 'error');
    dispatch({
      type: 'SET_AD_CONTENT',
      payload: { type: 'interstitial-blocked', size, reqW, reqH },
    });
    return;
  }

  addLog('Device resolution check: PASSED', '', '200', 'impression');

  const trimmed = tag.trim();
  let innerType = 'standard';
  if (trimmed.startsWith('<VAST') || trimmed.startsWith('<?xml')) innerType = 'vast';
  else if (trimmed.startsWith('{')) innerType = 'native';

  // Parse inner content first then wrap
  dispatch({ type: 'SET_AD_CONTENT', payload: { type: 'interstitial', innerTag: tag, innerType } });
  addLog('Interstitial displayed', '', '', 'impression');
}
