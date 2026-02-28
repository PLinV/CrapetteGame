const serv = "http://localhost:3000"; 
const urlBase = `${serv}/`;
const title = document.getElementById("title"); 
/*
async function chargeTitle() {
  try {
    const res = await fetch(urlBase);
    const messTilte = await res.json();
    title.innerText = messTilte.message;
    
    } catch (erreur) {
      title.innerText = 'impossible de joindre le serv';  
      }
      }
      */
     
function chargeTitle_Connection() {       
  const socket = new WebSocket("ws://localhost:3000");
  // 2. On écoute les messages entrants
  socket.onmessage = (event) => {
    // Le serveur nous a envoyé du texte (JSON.stringify), on le repasse en objet JavaScript
    const donnee = JSON.parse(event.data);
    
    // Si l'objet contient bien un "message", on remplace le texte du h1
    if (donnee.message) {
      title.innerText = donnee.message;
    }
  };

// 3. En cas d'erreur (si ton serveur index.js n'est pas allumé par exemple)
  socket.onerror = (erreur) => {
    title.innerText = 'Impossible de joindre le serveur';  
  };
}