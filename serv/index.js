import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
// do web socket things don't know what 


const app = express();
const port = 3000; 
app.use(cors());
/*  

app.get('/', (req, res) => {
  res.json({ message: 'Bonjour'})
}); 

app.listen(port, () => {
  
}); 
*/

// On crée le serveur HTTP et on y attache le WebSocket
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Dès qu'une page se charge (ou se recharge), cet événement se déclenche
wss.on('connection', (ws) => {
    console.log('Nouvelle page chargée : Un client vient de se connecter !');

    // On prépare notre message sous forme d'objet
    const reponse = { message: 'Bonjour' };
    
    // On l'envoie IMMÉDIATEMENT au client qui vient de se connecter
    ws.send(JSON.stringify(reponse));

    // Si le joueur ferme l'onglet ou recharge la page
    ws.on('close', () => {
        console.log('Un client a fermé la page ou rechargé.');
    });
});

httpServer.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
