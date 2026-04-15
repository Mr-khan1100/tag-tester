/**
 * lib/tagUtils.js
 * Pure utility functions for ad tag parsing.
 * No React imports – usable anywhere.
 */

/** Detect tag type from raw string. Returns 'standard' | 'vast' | 'native' | 'video' | 'audio'. */
export function detectTagType(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('<VAST') || trimmed.startsWith('<?xml')) return 'vast';
  if (trimmed.startsWith('{')) {
    try {
      const obj = JSON.parse(trimmed);
      if (obj.native || obj.assets) return 'native';
    } catch (_) {}
  }
  if (/<video\b/i.test(trimmed)) return 'video';
  if (/<audio\b/i.test(trimmed)) return 'audio';
  return 'standard';
}

/** Parse a VAST XML string into a structured object. */
export function parseVAST(xmlStr) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const err = doc.querySelector('parsererror');
    if (err) return { error: 'XML parse error: ' + err.textContent.slice(0, 120) };

    const getText = (selector) => {
      const el = doc.querySelector(selector);
      return el ? el.textContent.trim() : null;
    };

    const impression = getText('Impression');
    const vastUri = getText('VASTAdTagURI');
    const clickThrough = getText('ClickThrough');

    const mediaFiles = Array.from(doc.querySelectorAll('MediaFile')).map((m) => ({
      url: m.textContent.trim(),
      type: m.getAttribute('type') || '',
      width: m.getAttribute('width') || '',
      height: m.getAttribute('height') || '',
      delivery: m.getAttribute('delivery') || '',
    }));

    const trackings = Array.from(doc.querySelectorAll('Tracking')).map((t) => ({
      event: t.getAttribute('event') || 'unknown',
      url: t.textContent.trim(),
    }));

    const errorUrl = getText('Error');
    const adTitle = getText('AdTitle');
    const version = doc.querySelector('VAST')?.getAttribute('version') || 'unknown';

    return { version, impression, vastUri, clickThrough, mediaFiles, trackings, errorUrl, adTitle };
  } catch (e) {
    return { error: e.message };
  }
}

/** Parse native JSON into a normalized object. */
export function parseNative(jsonStr) {
  try {
    const raw = JSON.parse(jsonStr);
    const n = raw.native || raw;
    const assets = n.assets || [];

    const findAsset = (id) => assets.find((a) => a.id === id || a.id === String(id));

    return {
      title: findAsset(0)?.title?.text || '',
      desc: findAsset(1)?.data?.value || '',
      cta: findAsset(2)?.data?.value || 'Learn More',
      iconUrl: findAsset(3)?.img?.url || '',
      heroUrl: findAsset(4)?.img?.url || '',
      clickUrl: n.link?.url || '#',
      impTrackers: n.imptrackers || [],
    };
  } catch (e) {
    return { error: 'JSON parse error: ' + e.message };
  }
}

/** Extract all URLs from a raw HTML tag string. */
export function extractUrlsFromHTML(html) {
  const urls = {};
  const imgMatch = html.match(/src=["']([^"']+)["']/i);
  const hrefMatch = html.match(/href=["']([^"']+)["']/i);
  if (imgMatch) urls.impression = imgMatch[1];
  if (hrefMatch) urls.click = hrefMatch[1];
  return urls;
}

/** Fire a tracking URL using no-cors fetch. Returns status string. */
export async function fireTracker(url) {
  try {
    const resp = await fetch(url, { method: 'GET', mode: 'no-cors', cache: 'no-cache' });
    return resp.status === 0 ? 'fired' : String(resp.status);
  } catch (e) {
    return 'NET_ERR';
  }
}

/** Format a Date to HH:MM:SS */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
