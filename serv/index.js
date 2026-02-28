import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
// do web socket things don't know what 


const app = express();
const port = 3000; 
app.use(cors());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  console.log( 'Nouvelle page chargée : Un client vient de se connecter !' );
  const acitveT1 = {cible:'t1', message: "acitveT1" }
  ws.send(JSON.stringify(acitveT1));
  
  ws.on('message', (messageBrut) => {
    var reponse; 
    const requete = JSON.parse(messageBrut.toString()); 
    switch (requete.message) {
      case 'oui':
        reponse = { cible:'t2', message: 'Bonjour'}
        break; 
      case 'non': 
        reponse = { cible:'t2', message: 'bon bah non alors'}
        break; 
      default:
        reponse = { cible:'t2', message: 'mais que veut tu'} 
        
      }
    ws.send(JSON.stringify(reponse));
    // On l'envoie IMMÉDIATEMENT au client qui vient de se connecter
  })

  
  ws.on('close', () => {
    console.log('Un client a fermé la page ou rechargé.');
  });
});

httpServer.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
