(function() {
  'use strict';

  function openModal(type) {
    const modal = document.getElementById(`${type}-modal`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  function closeModal(type) {
    const modal = document.getElementById(`${type}-modal`);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      const form = modal.querySelector('form');
      if (form) {
        form.reset();
      }
    }
  }

  function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    if (!email || !password) {
      showMessage('Barcha maydonlarni to\'ldiring', 'error');
      return;
    }

    // Admin kirish tekshiruvi
    if (window.loginAdmin && window.loginAdmin(email.trim(), password)) {
      const sessionData = {
        username: 'JonsbekUz',
        email: 'admin@watcher.uz',
        loginTime: new Date().toISOString()
      };
      
      if (remember) {
        localStorage.setItem('watcher_session', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('watcher_session', JSON.stringify(sessionData));
      }

      showMessage('Admin sifatida kirildi!', 'success');
      closeModal('login');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }

    const users = JSON.parse(localStorage.getItem('watcher_users') || '[]');
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);

    if (user) {
      const sessionData = {
        username: user.username,
        email: user.email,
        loginTime: new Date().toISOString()
      };
      
      if (remember) {
        localStorage.setItem('watcher_session', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('watcher_session', JSON.stringify(sessionData));
      }

      showMessage(`Xush kelibsiz, ${user.username}!`, 'success');
      closeModal('login');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showMessage('Email yoki parol noto\'g\'ri', 'error');
    }
  }

  function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    const terms = formData.get('terms');

    if (!username || !email || !password || !confirm) {
      showMessage('Barcha maydonlarni to\'ldiring', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak', 'error');
      return;
    }

    if (password !== confirm) {
      showMessage('Parollar mos kelmaydi', 'error');
      return;
    }

    if (!terms) {
      showMessage('Foydalanish shartlarini qabul qilishingiz kerak', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('watcher_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      showMessage('Bu email allaqachon ro\'yxatdan o\'tgan', 'error');
      return;
    }

    if (users.find(u => u.username === username)) {
      showMessage('Bu foydalanuvchi nomi allaqachon band', 'error');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('watcher_users', JSON.stringify(users));

    showMessage('Ro\'yxatdan muvaffaqiyatli o\'tdingiz!', 'success');
    closeModal('register');
    
    setTimeout(() => {
      openModal('login');
    }, 500);
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

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      const modalId = e.target.id;
      if (modalId) {
        closeModal(modalId.replace('-modal', ''));
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        const modalId = activeModal.id.replace('-modal', '');
        closeModal(modalId);
      }
    }
  });

  function getCurrentUser() {
    const session = sessionStorage.getItem('watcher_session') || localStorage.getItem('watcher_session');
    return session ? JSON.parse(session) : null;
  }

  function updateHeader() {
    const user = getCurrentUser();
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const isAdminUser = window.isAdmin ? window.isAdmin() : false;

    if (user) {
      let adminBtn = '';
      if (isAdminUser) {
        adminBtn = `<button class="nav-btn admin-btn" onclick="openModal('admin')" title="Admin panel">
          <span>⚙️</span>
          <span>Admin</span>
        </button>`;
      }
      
      navActions.innerHTML = `
        <button id="theme-toggle" class="theme-toggle" onclick="window.watcherTheme.cycle()" aria-label="Theme toggle">
          <span class="theme-icon">🌓</span>
        </button>
        ${adminBtn}
        <button class="nav-btn profile-btn" onclick="openModal('profile')">
          <span class="profile-icon">👤</span>
          <span>${user.username}</span>
        </button>
      `;
    } else {
      navActions.innerHTML = `
        <button id="theme-toggle" class="theme-toggle" onclick="window.watcherTheme.cycle()" aria-label="Theme toggle">
          <span class="theme-icon">🌓</span>
        </button>
        <button class="nav-btn" onclick="openModal('register')">Ro'yxatdan o'tish</button>
        <button class="nav-btn primary" onclick="openModal('login')">Kirish</button>
      `;
    }
  }

  function logout() {
    sessionStorage.removeItem('watcher_session');
    localStorage.removeItem('watcher_session');
    if (window.logoutAdmin) {
      window.logoutAdmin();
    }
    showMessage('Tizimdan chiqdingiz', 'success');
    updateHeader();
    if (window.updateFavoritesDisplay) {
      window.updateFavoritesDisplay();
    }
    closeModal('profile');
    closeModal('admin');
  }

  window.openModal = openModal;
  window.closeModal = closeModal;
  window.handleLogin = handleLogin;
  window.handleRegister = handleRegister;
  window.getCurrentUser = getCurrentUser;
  window.updateHeader = updateHeader;
  window.logout = logout;

  document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
  });
})();

