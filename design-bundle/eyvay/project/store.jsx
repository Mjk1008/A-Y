// EyVay — app store (global state via React context + hook)
const { useState, useEffect, useContext, useRef, useCallback, createContext, useMemo } = React;

const EYStore = createContext(null);

function EYProvider({ children }) {
  const [route, setRoute] = useState({ name: 'splash', params: {} });
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('home');
  const [saved, setSaved] = useState(new Set(['d3']));
  const [cart, setCart] = useState([]); // [{id, qty}]
  const [searchQ, setSearchQ] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [toast, setToast] = useState(null);

  // splash → home auto-advance
  useEffect(() => {
    if (route.name === 'splash') {
      const t = setTimeout(() => setRoute({ name: 'onboarding', params: {} }), 1800);
      return () => clearTimeout(t);
    }
  }, [route.name]);

  const nav = useCallback((name, params = {}) => {
    setHistory(h => [...h, route]);
    setRoute({ name, params });
  }, [route]);

  const back = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setRoute(prev);
      return h.slice(0, -1);
    });
  }, []);

  const goTab = useCallback((t) => {
    setTab(t);
    setHistory([]);
    const map = { home: 'home', search: 'search', saved: 'saved', bag: 'cart', user: 'profile' };
    setRoute({ name: map[t] || 'home', params: {} });
  }, []);

  const toggleSaved = useCallback((id) => {
    setSaved(s => {
      const n = new Set(s);
      if (n.has(id)) { n.delete(id); flash('از ذخیره‌ها حذف شد'); }
      else { n.add(id); flash('ذخیره شد'); }
      return n;
    });
  }, []);

  const addToCart = useCallback((id, qty = 1) => {
    setCart(c => {
      const i = c.findIndex(x => x.id === id);
      if (i >= 0) {
        const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + qty }; return n;
      }
      return [...c, { id, qty }];
    });
    flash('به سبد اضافه شد');
  }, []);

  const setCartQty = useCallback((id, qty) => {
    setCart(c => qty <= 0 ? c.filter(x => x.id !== id) : c.map(x => x.id === id ? { ...x, qty } : x));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  const getDeal = useCallback((id) => window.EY_DATA.deals.find(d => d.id === id), []);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const cartTotal = cart.reduce((s, x) => {
    const d = getDeal(x.id);
    return s + (d ? d.price * x.qty : 0);
  }, 0);
  const cartSavings = cart.reduce((s, x) => {
    const d = getDeal(x.id);
    return s + (d ? (d.old - d.price) * x.qty : 0);
  }, 0);

  return (
    <EYStore.Provider value={{
      route, nav, back, history,
      tab, goTab,
      saved, toggleSaved,
      cart, addToCart, setCartQty, clearCart,
      cartCount, cartTotal, cartSavings,
      searchQ, setSearchQ,
      activeCat, setActiveCat,
      toast, flash,
      getDeal,
    }}>
      {children}
    </EYStore.Provider>
  );
}

function useEY() { return useContext(EYStore); }

Object.assign(window, { EYProvider, useEY });
