// App state for the prototype: cart, saves, follows, things you publish, pitches.
// Kept in memory and mirrored to this browser's localStorage so a refresh keeps your demo going.
import { useState, useEffect, useContext, createContext, useCallback } from './ds.js';
import { ASSETS, GIGS, ACTIVITY, priceFor, asset as baseAsset, gig as baseGig } from './data.js';

const KEY = 'nudge-demo-v1';
const Ctx = createContext(null);
const initial = { cart: [], saved: ['pastel3d'], following: ['priya'], myAssets: [], myGigs: [], pitches: [], purchases: [], notifications: ACTIVITY, theme: 'system' };
function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s ? { ...initial, ...s } : initial; } catch (e) { return initial; } }

/* ---------- routing: #page or #page.param (bare hash tokens only) ---------- */
export function parseRoute() {
  const h = decodeURIComponent((location.hash || '').slice(1));
  const i = h.indexOf('.');
  return i < 0 ? { page: h || 'home', param: null } : { page: h.slice(0, i), param: h.slice(i + 1) };
}
export function go(page, param) { location.hash = page + (param ? '.' + param : ''); }
export function useRoute() {
  const [r, setR] = useState(parseRoute());
  useEffect(() => { const f = () => setR(parseRoute()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return r;
}

export function StoreProvider({ children }) {
  const [s, setS] = useState(load);
  const [ui, setUi] = useState({ cart: false, search: false, toasts: [], confetti: 0 });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }, [s]);
  useEffect(() => {
    const el = document.documentElement;
    if (s.theme === 'system') el.removeAttribute('data-theme'); else el.setAttribute('data-theme', s.theme);
  }, [s.theme]);
  const patch = useCallback(fn => setS(prev => ({ ...prev, ...fn(prev) })), []);

  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setUi(u => ({ ...u, toasts: [...u.toasts, { id, message, ...opts }] }));
    setTimeout(() => setUi(u => ({ ...u, toasts: u.toasts.filter(t => t.id !== id) })), opts.duration || 4000);
  }, []);
  const dismissToast = id => setUi(u => ({ ...u, toasts: u.toasts.filter(t => t.id !== id) }));
  const celebrate = () => setUi(u => ({ ...u, confetti: u.confetti + 1 }));

  const allAssets = [...s.myAssets, ...ASSETS];
  const allGigs = [...s.myGigs, ...GIGS];
  const api = {
    ...s, ui,
    allAssets, allGigs,
    asset: id => s.myAssets.find(a => a.id === id) || baseAsset(id),
    gig: id => s.myGigs.find(g => g.id === id) || baseGig(id),
    toast, dismissToast, celebrate,
    setTheme: theme => patch(() => ({ theme })),
    openCart: (open = true) => setUi(u => ({ ...u, cart: open })),
    openSearch: (open = true) => setUi(u => ({ ...u, search: open })),
    isSaved: id => s.saved.includes(id),
    toggleSave: (id, opts = {}) => {
      const on = s.saved.includes(id);
      setS(p => { const has = p.saved.includes(id); return { ...p, saved: has ? p.saved.filter(x => x !== id) : [...p.saved, id] }; });
      if (!opts.silent) toast(on ? 'Removed from saved' : 'Saved to your board', { variant: on ? 'neutral' : 'success' });
    },
    isFollowing: id => s.following.includes(id),
    toggleFollow: id => setS(p => ({ ...p, following: p.following.includes(id) ? p.following.filter(x => x !== id) : [...p.following, id] })),
    inCart: id => s.cart.some(c => c.id === id),
    addToCart: (id, license = 'personal', opts = {}) => {
      patch(p => ({ cart: [...p.cart.filter(c => c.id !== id), { id, license }] }));
      if (!opts.silent) toast('Added to cart', { actionLabel: 'View cart', onAction: () => setUi(u => ({ ...u, cart: true })) });
    },
    addManyToCart: (items) => patch(p => ({ cart: [...p.cart.filter(c => !items.some(i => i.id === c.id)), ...items.map(i => ({ id: i.id, license: i.license || 'personal' }))] })),
    claimFree: id => { patch(p => ({ purchases: [{ id, license: 'personal' }, ...p.purchases.filter(x => x.id !== id)] })); celebrate(); toast('It’s yours. Files are in Downloads.', { duration: 5000 }); },
    removeFromCart: id => patch(p => ({ cart: p.cart.filter(c => c.id !== id) })),
    cartTotal: () => s.cart.reduce((sum, c) => { const a = s.myAssets.find(x => x.id === c.id) || baseAsset(c.id); return sum + (a ? priceFor(a, c.license) : 0); }, 0),
    checkout: () => { patch(p => ({ purchases: [...p.cart, ...p.purchases], cart: [] })); celebrate(); toast('Paid. Your files are in Downloads.', { duration: 5000 }); },
    owns: id => s.purchases.some(c => c.id === id),
    publishAsset: a => { patch(p => ({ myAssets: [a, ...p.myAssets] })); celebrate(); },
    postGig: g => { patch(p => ({ myGigs: [g, ...p.myGigs] })); celebrate(); },
    pitch: pt => { patch(p => ({ pitches: [{ ...pt, status: 'Sent', at: Date.now() }, ...p.pitches.filter(x => x.gigId !== pt.gigId)] })); celebrate(); },
    pitchFor: gigId => s.pitches.find(p => p.gigId === gigId),
    markAllRead: () => patch(p => ({ notifications: p.notifications.map(n => ({ ...n, unread: false })) })),
    reset: () => { setS(initial); toast('Demo reset', { variant: 'neutral' }); },
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
