'use client';

import { useState, useRef } from 'react';
import { useTester } from '@/components/TesterContext';

const EVENT_STYLES = {
  impression: { bg: 'var(--accent3-dim)', color: 'var(--accent3)' },
  click:      { bg: 'var(--accent-dim)',  color: 'var(--accent)'  },
  error:      { bg: 'var(--error-dim)',   color: 'var(--error)'   },
  start:      { bg: 'var(--accent2-dim)', color: '#a78bfa'        },
  complete:   { bg: 'var(--accent3-dim)', color: 'var(--accent3)' },
  request:    { bg: 'var(--warn-dim)',    color: 'var(--warn)'    },
  info:       { bg: 'rgba(255,255,255,0.05)', color: 'var(--text2)' },
};

function getCodeStyle(code) {
  if (!code || code === '—' || code === 'pending') return { color: 'var(--text3)' };
  const n = Number(code);
  if (code === 'fired') return { background: 'var(--accent3-dim)', color: 'var(--accent3)' };
  if (code === 'NET_ERR') return { background: 'var(--error-dim)', color: 'var(--error)' };
  if (n >= 200 && n < 300) return { background: 'var(--accent3-dim)', color: 'var(--accent3)' };
  if (n >= 300 && n < 400) return { background: 'var(--warn-dim)', color: 'var(--warn)' };
  if (n >= 400) return { background: 'var(--error-dim)', color: 'var(--error)' };
  return { color: 'var(--text3)' };
}

/** Highlight matching substring in a URL string */
function HighlightedUrl({ url, filter }) {
  if (!filter) return url;
  const idx = url.toLowerCase().indexOf(filter.toLowerCase());
  if (idx === -1) return url;
  return (
    <>
      {url.slice(0, idx)}
      <mark style={{ background: 'rgba(0,229,255,0.3)', color: 'var(--accent)', borderRadius: 2, padding: '0 1px' }}>
        {url.slice(idx, idx + filter.length)}
      </mark>
      {url.slice(idx + filter.length)}
    </>
  );
}

export default function EventLog() {
  const { state, dispatch } = useTester();
  const { logs } = state;
  const [urlFilter, setUrlFilter] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const filterInputRef = useRef(null);

  const trimmedFilter = urlFilter.trim().toLowerCase();

  // Filter: when active, only show rows where url contains the filter string.
  // Rows with no URL are hidden while filter is active.
  const visibleLogs = trimmedFilter
    ? logs.filter((l) => l.url && l.url.toLowerCase().includes(trimmedFilter))
    : logs;

  const copyLogs = () => {
    const text = visibleLogs
      .map((l) => `[${l.time}]\t${l.event}\t${l.url || '—'}\t${l.code || '—'}`)
      .join('\n');
    navigator.clipboard.writeText(text || 'No logs').catch(() => {});
  };

  const clearLogs = () => dispatch({ type: 'CLEAR_LOGS' });
  const clearFilter = () => { setUrlFilter(''); filterInputRef.current?.focus(); };

  const isFiltered = trimmedFilter.length > 0;

  return (
    <div style={{
      height: 230,
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Log Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 14px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        gap: 10,
      }}>
        {/* Left: title + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span className="label">📡 Event Log</span>
          {logs.length > 0 && (
            <span style={{
              background: isFiltered ? 'var(--warn)' : 'var(--accent2)',
              color: isFiltered ? '#000' : 'white',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 8px',
              fontFamily: 'var(--mono)',
              transition: 'background 0.2s',
            }}>
              {isFiltered ? `${visibleLogs.length} / ${logs.length}` : logs.length}
            </span>
          )}
        </div>

        {/* Center: URL filter input */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface2)',
          border: `1px solid ${isFiltered ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 7,
          padding: '0 8px',
          gap: 6,
          transition: 'border-color 0.18s',
          minWidth: 0,
        }}>
          <span style={{ fontSize: 11, color: isFiltered ? 'var(--accent)' : 'var(--text3)', flexShrink: 0 }}>🔍</span>
          <input
            ref={filterInputRef}
            type="text"
            value={urlFilter}
            onChange={(e) => setUrlFilter(e.target.value)}
            placeholder="Filter by URL contains…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--mono)',
              fontSize: 11,
              padding: '4px 0',
              minWidth: 0,
            }}
          />
          {isFiltered && (
            <button
              onClick={clearFilter}
              title="Clear filter"
              style={{
                background: 'rgba(0,229,255,0.12)',
                border: 'none',
                borderRadius: 4,
                color: 'var(--accent)',
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 6px',
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              ✕ clear
            </button>
          )}
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="btn btn-icon" onClick={copyLogs}>Copy</button>
          <button className="btn btn-icon" onClick={clearLogs}>Clear</button>
        </div>
      </div>

      {/* Filter active banner */}
      {isFiltered && (
        <div style={{
          padding: '3px 14px',
          background: 'rgba(0,229,255,0.06)',
          borderBottom: '1px solid rgba(0,229,255,0.15)',
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: 'var(--accent)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ opacity: 0.6 }}>Showing URLs containing</span>
          <span style={{
            background: 'rgba(0,229,255,0.18)',
            borderRadius: 3,
            padding: '1px 6px',
            fontWeight: 700,
          }}>"{urlFilter.trim()}"</span>
          <span style={{ opacity: 0.6 }}>— {visibleLogs.length} of {logs.length} rows</span>
        </div>
      )}

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {logs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: 12, fontFamily: 'var(--mono)' }}>
            No events yet. Run a tag to begin.
          </div>
        ) : visibleLogs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: 12, fontFamily: 'var(--mono)' }}>
            No URLs match <span style={{ color: 'var(--accent)' }}>"{urlFilter.trim()}"</span>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            fontSize: 11,
            fontFamily: 'var(--mono)',
          }}>
            <colgroup>
              <col style={{ width: '82px' }} />
              <col style={{ width: '110px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '72px' }} />
            </colgroup>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: 'var(--surface2)', zIndex: 2 }}>
                {['Time', 'Event', 'URL', 'Code'].map((h) => (
                  <th key={h} style={{
                    padding: '5px 10px',
                    textAlign: 'left',
                    color: 'var(--text3)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log) => {
                const evStyle = EVENT_STYLES[log.eventClass] || EVENT_STYLES.info;
                const codeStyle = getCodeStyle(log.code);
                return (
                  <tr
                    key={log.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Time */}
                    <td style={{ padding: '5px 10px', color: 'var(--text3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                      {log.time}
                    </td>

                    {/* Event badge */}
                    <td style={{ padding: '5px 10px', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: evStyle.bg,
                        color: evStyle.color,
                        fontSize: 10,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{log.event}</span>
                    </td>

                    {/* URL — truncated, clickable, highlighted */}
                    <td style={{ padding: '5px 10px', verticalAlign: 'middle', overflow: 'hidden' }}>
                      {log.url && log.url.startsWith('http') ? (
                        <span
                          onClick={() => setSelectedUrl(log.url)}
                          title={log.url}
                          style={{
                            color: 'var(--text2)',
                            cursor: 'pointer',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text2)')}
                        >
                          <HighlightedUrl url={log.url} filter={trimmedFilter} />
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text3)' }}>—</span>
                      )}
                    </td>

                    {/* Code */}
                    <td style={{ padding: '5px 10px', verticalAlign: 'middle' }}>
                      {log.code && log.code !== '' ? (
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 7px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          ...codeStyle,
                        }}>{log.code}</span>
                      ) : (
                        <span style={{ color: 'var(--text3)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {selectedUrl && (
          <div
            onClick={() => setSelectedUrl(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 20,
                maxWidth: '80%',
                maxHeight: '70%',
                overflow: 'auto',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--text)',
                wordBreak: 'break-all',
              }}
            >
              <div style={{ marginBottom: 10, fontWeight: 700 }}>Full URL</div>

              <div style={{ marginBottom: 15 }}>
                {selectedUrl}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  className="btn btn-icon"
                  onClick={() => navigator.clipboard.writeText(selectedUrl)}
                >
                  Copy
                </button>

                <button
                  className="btn btn-icon"
                  onClick={() => setSelectedUrl(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}