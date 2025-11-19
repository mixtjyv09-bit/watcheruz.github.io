(function() {
  'use strict';

  const ADMIN_CREDENTIALS = {
    username: 'JonsbekUz',
    password: 'jonsbek09'
  };

  function isAdmin() {
    const session = sessionStorage.getItem('watcher_admin') || localStorage.getItem('watcher_admin');
    return session === 'true';
  }

  function loginAdmin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('watcher_admin', 'true');
      sessionStorage.setItem('watcher_admin', 'true');
      return true;
    }
    return false;
  }

  function logoutAdmin() {
    localStorage.removeItem('watcher_admin');
    sessionStorage.removeItem('watcher_admin');
  }

  function getAllUsers() {
    return JSON.parse(localStorage.getItem('watcher_users') || '[]');
  }

  function getAllFavorites() {
    const users = getAllUsers();
    const allFavorites = {};
    
    users.forEach(user => {
      const key = `watcher_favorites_${user.username}`;
      const favorites = JSON.parse(localStorage.getItem(key) || '[]');
      if (favorites.length > 0) {
        allFavorites[user.username] = favorites;
      }
    });
    
    return allFavorites;
  }

  function getStats() {
    const users = getAllUsers();
    const allFavorites = getAllFavorites();
    let totalFavorites = 0;
    
    Object.values(allFavorites).forEach(favs => {
      totalFavorites += favs.length;
    });

    return {
      totalUsers: users.length,
      totalFavorites: totalFavorites,
      activeUsers: Object.keys(allFavorites).length
    };
  }

  function deleteUser(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      const newUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('watcher_users', JSON.stringify(newUsers));
      
      const key = `watcher_favorites_${user.username}`;
      localStorage.removeItem(key);
      
      return true;
    }
    return false;
  }

  window.isAdmin = isAdmin;
  window.loginAdmin = loginAdmin;
  window.logoutAdmin = logoutAdmin;
  window.getAllUsers = getAllUsers;
  window.getAllFavorites = getAllFavorites;
  window.getStats = getStats;
  window.deleteUser = deleteUser;
})();

