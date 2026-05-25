(function () {
  // L'URL de ton serveur Node.js (A remplacer plus tard par l'URL Render/Glitch)
  // Pour l'instant on met une variable (localhost par défaut)
  const API_URL = "http://localhost:4000/players";

  const playersContainer = document.getElementById('playersContainer');
  const playerCountSpan = document.getElementById('player-count');
  const serverStatusDot = document.getElementById('server-status-dot');
  const loadingState = document.getElementById('loadingState');

  async function fetchPlayers() {
    try {
      // On interroge l'API
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Serveur injoignable");

      const players = await response.json();

      // Serveur en ligne
      serverStatusDot.classList.add('online');
      updatePlayersUI(players);

    } catch (error) {
      // Serveur hors ligne
      serverStatusDot.classList.remove('online');
      playerCountSpan.textContent = "Serveur Hors Ligne";
      playersContainer.innerHTML = "";
      loadingState.style.display = "block";
      loadingState.textContent = "Serveur Backend hors ligne. Assure-toi que server.js est lancé.";
    }
  }

  function updatePlayersUI(players) {
    if (!playersContainer) return;

    playerCountSpan.textContent = `${players.length} Joueur(s) en ligne`;

    if (players.length === 0) {
      playersContainer.innerHTML = '';
      loadingState.style.display = "block";
      loadingState.textContent = "Aucun joueur connecté sur la map Roblox pour le moment.";
      return;
    }

    loadingState.style.display = "none";
    playersContainer.innerHTML = '';

    players.forEach(player => {
      const card = document.createElement('div');
      card.className = 'player-card';

      // On utilise l'API de Roblox pour générer un avatar si on a le userId 
      const avatarUrl = player.userId
        ? `https://www.roblox.com/headshot-thumbnail/image?userId=${player.userId}&width=150&height=150&format=png`
        : `https://ui-avatars.com/api/?name=${player.name}&background=random&color=fff`;

      card.innerHTML = `
        <div class="player-avatar">
          <img src="${avatarUrl}" alt="${player.name}">
        </div>
        <div class="player-info">
          <span class="player-name">${player.name}</span>
          <span class="player-status">🟢 En jeu</span>
        </div>
      `;

      playersContainer.appendChild(card);
    });
  }

  // Interroger le serveur toutes les 3 secondes
  setInterval(fetchPlayers, 3000);

  // Premier appel
  fetchPlayers();

})();
