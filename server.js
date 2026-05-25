const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Autorise le site à récupérer les données
app.use(express.json()); // Permet de lire le JSON envoyé par Roblox

// Base de données temporaire en mémoire
let connectedPlayers = [];

// Route GET : Le site web l'utilise pour afficher les joueurs
app.get('/players', (req, res) => {
  res.json(connectedPlayers);
});

// Route POST : Roblox l'utilise pour envoyer la liste des joueurs
app.post('/update-players', (req, res) => {
  const { players } = req.body;
  if (Array.isArray(players)) {
    connectedPlayers = players;
    console.log(`[Roblox] Liste mise à jour : ${players.length} joueur(s)`);
    res.json({ success: true, message: "Liste mise à jour avec succès" });
  } else {
    res.status(400).json({ success: false, message: "Format invalide" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`-> Le site web doit pointer vers http://localhost:${PORT}/players (en local)`);
  console.log(`-> Roblox doit faire un POST sur http://localhost:${PORT}/update-players`);
});
