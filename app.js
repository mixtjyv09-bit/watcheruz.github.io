const data = [
    { title: "Yengil Serial", status: "ongoing", format: "serial", dubbed: true, info: "S01 · 6/12", cover: "https://images6.alphacoders.com/133/1337465.jpg" },
    { title: "Klassik Serial", status: "completed", format: "serial", dubbed: false, info: "S02 · 24/24", cover: "https://images8.alphacoders.com/133/1333824.png" },
    { title: "Anime Film", status: "movie", format: "movie", dubbed: true, info: "Film · 115 daqiqa", cover: "https://images4.alphacoders.com/132/1328183.png" },
    { title: "Retro Festival", status: "completed", format: "movie", dubbed: false, info: "Film · 98 daqiqa", cover: "https://images6.alphacoders.com/132/1324751.jpeg" },
    { title: "Cyber Pulse", status: "ongoing", format: "serial", dubbed: true, info: "S03 · 9/20", cover: "https://images3.alphacoders.com/131/1311075.jpeg" }
  ];
  
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty-state");
  
  function render(filter = "all") {
    if (!grid) return;
  
    const filtered = data.filter(item => {
      if (filter === "ongoing") return item.status === "ongoing";
      if (filter === "completed") return item.status === "completed";
      if (filter === "movie") return item.format === "movie";
      if (filter === "dubbed") return item.dubbed;
      return true;
    });
  
    grid.innerHTML = filtered.map(item => {
      const isFav = window.isFavorite ? window.isFavorite(item) : false;
      return `
      <article class="card">
        <div class="card-image-wrapper">
          <img src="${item.cover}" alt="${item.title}">
          <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="handleFavoriteClick(event, ${JSON.stringify(item).replace(/"/g, '&quot;')})" title="Sevimlilarga qo'shish">
            <span class="heart-icon">${isFav ? '❤️' : '🤍'}</span>
          </button>
        </div>
        <div class="card-body">
          <strong>${item.title}</strong>
          <span>${item.info}</span>
          <span>${item.dubbed ? "Dublyaj" : "Subtitrlangan"}</span>
        </div>
      </article>
    `;
    }).join("");
  
    if (empty) {
      empty.style.display = filtered.length ? "none" : "block";
    }
  }
  
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.filter);
    });
  });
  
  function handleFavoriteClick(event, anime) {
    event.stopPropagation();
    if (window.toggleFavorite) {
      const isFav = window.toggleFavorite(anime);
      const btn = event.target.closest('.favorite-btn');
      if (btn) {
        btn.classList.toggle('active', isFav);
        const icon = btn.querySelector('.heart-icon');
        if (icon) {
          icon.textContent = isFav ? '❤️' : '🤍';
        }
      }
      if (window.updateFavoritesDisplay) {
        window.updateFavoritesDisplay();
      }
    }
  }

  window.handleFavoriteClick = handleFavoriteClick;
  render();