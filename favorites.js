(function() {
  'use strict';

  function getFavorites() {
    const session = getCurrentUser();
    if (!session) return [];
    const key = `watcher_favorites_${session.username}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  function saveFavorites(favorites) {
    const session = getCurrentUser();
    if (!session) return;
    const key = `watcher_favorites_${session.username}`;
    localStorage.setItem(key, JSON.stringify(favorites));
  }

  function toggleFavorite(anime) {
    const session = getCurrentUser();
    if (!session) {
      showMessage('Sevimlilarga qo\'shish uchun tizimga kiring', 'error');
      return false;
    }

    const favorites = getFavorites();
    const index = favorites.findIndex(f => f.title === anime.title);
    
    if (index > -1) {
      favorites.splice(index, 1);
      saveFavorites(favorites);
      return false;
    } else {
      favorites.push(anime);
      saveFavorites(favorites);
      return true;
    }
  }

  function isFavorite(anime) {
    const favorites = getFavorites();
    return favorites.some(f => f.title === anime.title);
  }

  function getCurrentUser() {
    const session = sessionStorage.getItem('watcher_session') || localStorage.getItem('watcher_session');
    return session ? JSON.parse(session) : null;
  }

  function showMessage(text, type) {
    const existing = document.querySelector('.toast-message');
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = text;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  window.getFavorites = getFavorites;
  window.toggleFavorite = toggleFavorite;
  window.isFavorite = isFavorite;
  window.getCurrentUser = getCurrentUser;
})();

