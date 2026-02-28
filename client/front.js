const serv = "http://localhost:3000"; 
const urlBase = `${serv}/`;
const title1 = document.getElementById("title1");
const title2 = document.getElementById("title2") 
const socket = new WebSocket("ws://localhost:3000");

function chargeTitle2() {    
 socket.send(JSON.stringify( {message: "oui"} ))
};

function mettreAJourTitre1(texte) {
  title1.innerText = texte;
}

function mettreAJourTitre2(texte) {
  title2.innerText = texte;
}

socket.onopen = () => {
  console.log("Le serveur a décroché ! On peut parler.");
  
  chargeTitle2();
};

socket.onmessage = (event) => {
  const donneesRecues = JSON.parse(event.data);

  switch (donneesRecues.cible) {
    
    case 't1':
      mettreAJourTitre1(donneesRecues.message);
      break;
      
    case 't2':
      mettreAJourTitre2(donneesRecues.message);
      break;
      
    default:
      console.log("Étiquette inconnue :", donneesRecues);
  }
};