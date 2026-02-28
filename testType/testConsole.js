import { Pack } from "../type/Pack.js";
import { Card } from "../type/Card.js";
import { Player } from "../type/Player.js";
import { Board } from "../type/Board.js";
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

console.clear(); 
console.log("Bonjour, initialisation du board")
console.log("---------------------------------------");
const j1 = await rl.question('Entrez le pseudo du Joueur 1 : ') || "Joueur 1";
const j2 = await rl.question('Entrez le pseudo du Joueur 2 : ') || "Joueur 2"; 
const game = new Board(j1, j2); 
console.log(`\n✅ Match configuré : ${j1} VS ${j2}`);
game.initGame()
game.whoBegins()
if (game.active === 1) {
  console.log(`${j1} tu commences`)
} else {
  console.log(`${j2} tu commences`)      
}

async function gameLoop() {
  let gameRunning = true;

  while(gameRunning) {
    // on affiche le plateau à chaque tour pour voir les changements
    //console.clear();
    console.log(game.toString());
    
    let actionPrincipale = "";
    
    if (game.selectedCard[0] === null) {
      actionPrincipale = " - select <slot> (ex: select 13) : Prendre une carte";
    } else {
      // On affiche la carte qu'il tient pour rappel
      const carteTenue = game.selectedCard[0].toString();
      actionPrincipale = ` - poser <slot>  (ex: poser 31)  : Poser votre [${carteTenue}]\n` +
                         ` - annuler                     : Lâcher la carte sélectionnée`;
    }

    const nomJoueurActif = (game.active === 1) ? j1 : j2;
    if (game.active === 1) {
      console.log(`${j1} à toi de jouer : `)
    } else {
      console.log(`${j2} à toi de jouer : `)      
    }
    
    // liste des commandes pour le joueur
    console.log("\nCommandes disponibles :");
    console.log(actionPrincipale);
    console.log(" - tirer                       : Piocher une carte (si applicable)");
    console.log(" - crapette                    : Annoncer une Crapette");
    console.log(" - passe                       : Finir son tour");
    console.log(" - exit                        : Quitter le jeu");
    // on pose la question au joueur quel commande il veut faire parmi : select slot, tirer, crapette, ,passe ,exit 
    const answer = await rl.question('\nVotre action > ');
    const cleaned = answer.toLowerCase().trim();
    
    if (cleaned === 'exit') {
      console.log("Au revoir !");
      gameRunning = false;
      rl.close();
      break;
    }
    
    const match = cleaned.match(/^([a-z]+)\s*(\d+)?$/);

    if (!match) {
      console.log("❓ Commande incomprise.");
      continue;
    }

    const command = match[1];     // ex: "select"
    const arg = parseInt(match[2]); // ex: 13 (ou NaN si pas de nombre)

    // les actions : 
    switch (command) { // on récupére commande et on fait des actions en fonction de lui 
      case 'select':  // si command vaut 'select'
        if (isNaN(arg)) {
          console.log("⚠️ Précisez le slot (ex: select 13)");
        } else if (game.isSelectable(arg)) {
          game.selectCard(arg);
          console.log("✅ Carte sélectionnée.");
        } else {
          console.log("⛔ Ce slot n'est pas sélectionnable.");
        }
        break;
      
      case 'poser':   // si command vaut 'poser'
        if (isNaN(arg)) {
          console.log("⚠️ Précisez où poser (ex: poser 31)");
        } else if (game.selectedCard[0] === null) {
          console.log("⚠️ Aucune carte en main. Faites 'select' d'abord.");
        } else if (game.isPlayableTransferable(arg)) {
          game.cardTransfer(arg);
          console.log("✅ Carte posée avec succès.");

          const playerSlot = (game.active === 1)? [11, 12, 13] : [21, 22, 23];
          
          if (game.board[playerSlot[0]].isEmpty() && 
            game.board[playerSlot[1]].isEmpty() && 
            game.board[playerSlot[2]].isEmpty() &&
            game.selectedCard[0] === null) { // On vérifie aussi qu'il n'a plus rien en main
          
            console.clear();
            console.log(game.toString());
            console.log(`\n🏆 BRAVO ${nomJoueurActif} !! TU AS GAGNÉ LA PARTIE ! 🏆`);
          gameRunning = false;
            rl.close();
          }
        } else if (!game.isPlayableTransferable(arg)){
          console.log(`${arg}`)
          console.log("⛔ Coup impossible (Règles non respectées).");
        } else {
          console.log("???")
        } 

        break;    // fin

      case 'annuler':
        if (game.selectedCard[0] !== null) {
          // on remet la carte à sa place d'origine
          game.cancelSelection()
        } else {
          console.log("Aucune carte à annuler.");
        }
        break; // fin
      
      case 'tirer':
        if (game.canPlayPriorityCard()) {
          console.log("la zone prioritaire peut être jouer")
        } else {
          game.addDrawPile(); 
        }
        break;

      case 'crapette':
        if (game.isCrapette()) {
          console.log("🎉 CRAPETTE VALIDÉE ! Bien joué.");
          game.endRound();
        } else {
          console.log("❌ FAUSSE ACCUSATION. Pas de crapette.");
        }
        break; // fin

      case 'passe':
        console.log("Joueur suivant...");
        game.endRound();
        break; // fin


      default:        // 5. "Si rien n'a marché avant (le 'else' final)..."
        console.log("Je ne connais pas cette commande.");
    }
    // on attend avant de clear le board 
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}

gameLoop()