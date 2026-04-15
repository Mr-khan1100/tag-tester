'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { formatTime } from '@/lib/tagUtils';

/* ──────────────── STATE SHAPE ──────────────── */
const initialState = {
  device: 'desktop',       // 'desktop' | 'tablet' | 'mobile'
  rotated: false,           // mobile landscape toggle
  tagType: 'standard',      // 'standard' | 'vast' | 'native' | 'video' | 'audio' | 'interstitial'
  tagContent: '',
  reqWidth: 320,
  reqHeight: 480,
  logs: [],
  adContent: null,          // { type, payload } rendered in DevicePreview
  isRunning: false,
};

/* ──────────────── REDUCER ──────────────── */
function reducer(state, action) {
  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.payload, rotated: false };
    case 'TOGGLE_ROTATE':
      return { ...state, rotated: !state.rotated };
    case 'SET_TAG_TYPE':
      return { ...state, tagType: action.payload };
    case 'SET_TAG_CONTENT':
      return { ...state, tagContent: action.payload };
    case 'SET_REQ_WIDTH':
      return { ...state, reqWidth: Number(action.payload) };
    case 'SET_REQ_HEIGHT':
      return { ...state, reqHeight: Number(action.payload) };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, { id: Date.now() + Math.random(), ...action.payload }] };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    case 'SET_AD_CONTENT':
      return { ...state, adContent: action.payload };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

/* ──────────────── CONTEXT ──────────────── */
const TesterContext = createContext(null);

export function TesterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addLog = useCallback(
    (event, url = '', code = '', eventClass = 'info') => {
      dispatch({
        type: 'ADD_LOG',
        payload: { time: formatTime(), event, url, code, eventClass },
      });
    },
    []
  );

  const value = { state, dispatch, addLog };
  return <TesterContext.Provider value={value}>{children}</TesterContext.Provider>;
}

export function useTester() {
  const ctx = useContext(TesterContext);
  if (!ctx) throw new Error('useTester must be inside TesterProvider');
  return ctx;
}
