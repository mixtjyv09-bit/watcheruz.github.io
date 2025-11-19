(function() {
  'use strict';
  
  const THEME_KEY = 'watcher-theme';
  const THEMES = { LIGHT: 'light', DARK: 'dark', AUTO: 'auto' };
  
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  }
  
  function applyTheme(theme) {
    const root = document.documentElement;
    const actualTheme = theme === THEMES.AUTO ? getSystemTheme() : theme;
    
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${actualTheme}`);
    root.setAttribute('data-theme', actualTheme);
    
    localStorage.setItem(THEME_KEY, theme);
    
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon') || toggle;
      if (theme === THEMES.AUTO) {
        icon.textContent = '🌓';
        icon.title = 'Device mode (Auto)';
      } else if (theme === THEMES.DARK) {
        icon.textContent = '🌙';
        icon.title = 'Dark mode';
      } else {
        icon.textContent = '☀️';
        icon.title = 'Light mode';
      }
    }
  }
  
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || THEMES.AUTO;
    applyTheme(saved);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const current = localStorage.getItem(THEME_KEY) || THEMES.AUTO;
      if (current === THEMES.AUTO) {
        applyTheme(THEMES.AUTO);
      }
    });
  }
  
  function cycleTheme() {
    const current = localStorage.getItem(THEME_KEY) || THEMES.AUTO;
    let next;
    if (current === THEMES.LIGHT) next = THEMES.DARK;
    else if (current === THEMES.DARK) next = THEMES.AUTO;
    else next = THEMES.LIGHT;
    applyTheme(next);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
  window.watcherTheme = { apply: applyTheme, cycle: cycleTheme, getSystemTheme };
})();

