export type ThemeKey = 'dark' | 'cream' | 'sky';

export interface Theme {
  key: ThemeKey;
  label: string;
  desc: string;
  bg: string;
  bgGrad: string;
  surface: string;
  border: string;
  text: string;
  textDim: string;
  accent: string;
  accentHi: string;
  accentDeep: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  accentShadow: string;
  gold: string;
  tileColors: [string, string, string];
  isDark: boolean;
  // RGB triples for DOM recoloring (used by ThemeProvider)
  _rgb: {
    bg:        string; // "2,3,6"
    bgSoft:    string; // "5,9,10"
    surf1:     string; // "31,46,40" → light surface primary
    surf2:     string; // "18,30,24" → light surface secondary
    surfNav:   string; // "7,12,11"  → nav overlay
    text:      string; // "232,239,234"
    accent:    string; // "52,211,153"
    accentHi:  string; // "110,231,183"
    accentDeep:string; // "16,185,129"
    accentText:string; // "4,17,10"
  };
}

export const THEMES: Record<ThemeKey, Theme> = {
  dark: {
    key: 'dark', label: 'تاریک', desc: 'دنیای پیکسلی شبانه',
    bg: '#020306',
    bgGrad: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.09), transparent 60%), #020306',
    surface: 'linear-gradient(180deg, rgba(31,46,40,0.55) 0%, rgba(18,30,24,0.45) 100%)',
    border: 'rgba(110,231,183,0.16)', text: '#e8efea', textDim: 'rgba(232,239,234,0.62)',
    accent: '#34d399', accentHi: '#6ee7b7', accentDeep: '#10b981',
    accentBg: 'rgba(16,185,129,0.14)', accentBorder: 'rgba(110,231,183,0.30)',
    accentText: '#04110a', accentShadow: '0 4px 16px rgba(52,211,153,0.35)',
    gold: '#fcd34d', tileColors: ['#020306', '#0a1a14', '#34d399'], isDark: true,
    _rgb: {
      bg: '2,3,6', bgSoft: '5,9,10', surfNav: '7,12,11',
      surf1: '31,46,40', surf2: '18,30,24',
      text: '232,239,234', accent: '52,211,153',
      accentHi: '110,231,183', accentDeep: '16,185,129', accentText: '4,17,10',
    },
  },
  cream: {
    key: 'cream', label: 'کرمی', desc: 'روز مهربان و کاغذی',
    bg: '#f5efe3',
    bgGrad: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,120,90,0.10), transparent 60%), #f5efe3',
    surface: 'linear-gradient(180deg, rgba(255,250,240,0.90) 0%, rgba(252,245,231,0.80) 100%)',
    border: 'rgba(20,39,31,0.14)', text: '#14271f', textDim: 'rgba(20,39,31,0.68)',
    accent: '#059669', accentHi: '#047857', accentDeep: '#065f46',
    accentBg: 'rgba(5,150,105,0.12)', accentBorder: 'rgba(5,150,105,0.35)',
    accentText: '#ffffff', accentShadow: '0 4px 16px rgba(5,150,105,0.30)',
    gold: '#b45309', tileColors: ['#f5efe3', '#e8dec6', '#059669'], isDark: false,
    _rgb: {
      bg: '245,239,227', bgSoft: '237,229,211', surfNav: '255,252,246',
      surf1: '255,250,240', surf2: '252,245,231',
      text: '20,39,31', accent: '5,150,105',
      accentHi: '4,120,87', accentDeep: '6,95,70', accentText: '255,255,255',
    },
  },
  sky: {
    key: 'sky', label: 'آسمانی', desc: 'صبح مه‌آلود و سبز-آبی',
    bg: '#e6f0f0',
    bgGrad: 'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(16,185,129,0.14), transparent 60%), #e6f0f0',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(245,250,251,0.75) 100%)',
    border: 'rgba(14,116,144,0.20)', text: '#0c2a33', textDim: 'rgba(12,42,51,0.68)',
    accent: '#0e7490', accentHi: '#0891b2', accentDeep: '#155e75',
    accentBg: 'rgba(14,116,144,0.12)', accentBorder: 'rgba(14,116,144,0.38)',
    accentText: '#ffffff', accentShadow: '0 4px 16px rgba(14,116,144,0.28)',
    gold: '#b45309', tileColors: ['#e6f0f0', '#bfdfe4', '#0e7490'], isDark: false,
    _rgb: {
      bg: '230,240,240', bgSoft: '212,228,232', surfNav: '255,255,255',
      surf1: '255,255,255', surf2: '245,250,251',
      text: '12,42,51', accent: '14,116,144',
      accentHi: '8,145,178', accentDeep: '21,94,117', accentText: '255,255,255',
    },
  },
};
