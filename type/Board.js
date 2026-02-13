import { Player } from './Player.js';
import { Card } from './Card.js';
import { Pack } from './Pack.js';

  
export class Board {

  static zones = {
    1: [11, 12, 13],
    2: [21, 22, 23],
    3: [31, 32, 33, 34, 35, 36, 37, 38],
    4: [41, 42, 43, 44],
    5: [51, 52, 53, 54]
  }

  static symbol = ["Spade", "Club", "Diamond", "Heart"]
  
  constructor(p1, p2) {
    this.p1 = new Player(p1, 0)
    this.p2 = new Player(p2, 1)
    this.active = 0
    this.selectedCard = [null, null]
    
    // on a le droit de tirer qu'une seule carte du slot 12 si on ne la joue pas 
    this.countSlot12or22 = 0;
  
    // utile pour la crapette 
    this.crapetteSources = {
      41 : null,
      42 : null,
      43 : null,
      44 : null,  
      51 : null,
      52 : null,
      53 : null, 
      54 : null
    }
    this.lastMoveCard = null // la dérniere carte jouer
    this.lastMoveSlot = null // le dérnier slot bouger
    this.lastBoard = {} // avoir le board complé avoir d'avoir fait un mouvement  
    
    this.countCrapette = 0 // savoir si juste avant on a eu une crapette 
    // +1 quand quelqu'un dit crapette et donc on peut pas redire tout de suite crapette, on peut pas aller a plus que 1
    // -1 quand un joueurs pose une carte qui n'est pas dans la zone 4 ou 5


    this.board = {
      61: new Pack([]),
      62: new Pack([]),
      11: new Pack([]),
      12: new Pack([]),
      13: new Pack([]),
      21: new Pack([]),
      22: new Pack([]),
      23: new Pack([]),
      31: new Pack([]),
      32: new Pack([]),
      33: new Pack([]),
      34: new Pack([]),
      35: new Pack([]),
      36: new Pack([]),
      37: new Pack([]),
      38: new Pack([]),
      41: new Pack([]),
      42: new Pack([]),
      43: new Pack([]),
      44: new Pack([]),
      51: new Pack([]),
      52: new Pack([]),
      53: new Pack([]),
      54: new Pack([]),
    }   
  }

  toString() {
    let display = "\n=== Board state ===\n";
    display += `P1: ${this.p1.pseudo} vs P2: ${this.p2.pseudo}\n`
    
    const keys = Object.keys(this.board);
    let currentLine = ""; 

    // Définition des codes couleurs ANSI pour la console
    const RESET = "\x1b[0m";
    const RED = "\x1b[31m";
    const BLUE = "\x1b[34m"; // Bleu foncé standard
    // Note: Si le bleu est trop sombre sur ton écran, remplace [34m par [36m (Cyan) ou [94m (Bleu clair)

    for (const key of keys) {
      const pack = this.board[key];
      const count = pack.listCard.length;

      let topCardInfo = "";

      if(key === "12" || key === "22") {
        topCardInfo = "[     ....     ]".padEnd(25);
      } else if (pack.isEmpty()) {
        // Cas vide : pas de couleur, juste du texte
        topCardInfo = "[     VIDE     ]".padEnd(25);
      } else {
        const c = pack.getCard();
        
        // 1. On prépare le texte d'abord (ex: "[ As de Pique ]")
        const cardText = `[ ${c.toString()} ]`;
        
        // 2. On applique le padding (alignement) SUR LE TEXTE BRUT
        // C'est important de le faire AVANT la couleur pour garder les colonnes droites
        const paddedText = cardText.padEnd(25);

        // 3. On choisit la couleur (1 = Rouge, 0 = Bleu)
        const colorCode = (c.color === 1) ? RED : BLUE;

        // 4. On assemble : Couleur + Texte aligné + Reset couleur
        topCardInfo = `${colorCode}${paddedText}${RESET}`;
      }

      // Séparateur visuel
      if (currentLine !== "" && key[0] !== currentLine) {
        display += "----------------------------------\n";
      }
      currentLine = key[0];

      // Construction de la ligne
      display += `Slot ${key} : ${topCardInfo} (Total: ${count})\n`;
    }

    return display;
  }


  initGame() {
    let pack1 = []
    let pack2 = []
    for (const symbol of Board.symbol) {
      for (let i = 1; i < 14; i++) {
        pack1.push(new Card(0, symbol, i))
      }
    } 

    for (const symbol of Board.symbol) {
      for (let i = 1; i < 14; i++) {
        pack2.push(new Card(1, symbol, i))
      }
    } 

    this.board[61].listCard = pack1 
    this.board[62].listCard = pack2
    this.board[61].shuffle()
    this.board[62].shuffle()

    
    for(let i = 1; i < 5 ; i++){
      this.selectCard(61)
      this.cardTransfer(30+i)
    }

    for(let i = 1; i < 5 ; i++){
      this.selectCard(62)
      this.cardTransfer(34+i)
    }

    for(let i = 1; i < 13 ; i++){
      this.selectCard(61)
      this.cardTransfer(13)
    }

    for(let i = 1; i < 13 ; i++){
      this.selectCard(62)
      this.cardTransfer(23)
    }

    for(let i = 1; i < 37 ; i++){
      this.selectCard(61)
      this.cardTransfer(12)
    }
    
    for(let i = 1; i < 37 ; i++){
      this.selectCard(62)
      this.cardTransfer(22)
    }
    this.lastMoveCard = null
    this.lastMoveCard = null
  } 

  whoBegins() {
    if(this.board[13].getCard().num > this.board[23].getCard().num) {
      this.active = 1
      console.log("Player 1 begin")
    } else if (this.board[13].getCard().num < this.board[23].getCard().num) {
      this.active = 2
      console.log("Player 2 begin")
    } else {
      if (this.board[13].listCard[1].num > this.board[23].listCard[1].num) {
        this.active = 1
        console.log("Player 1 begin")
      } else if (this.board[13].listCard[1].num < this.board[23].listCard[1].num) {
        this.active = 2
        console.log("Player 2 begin")

      } else {
        this.active = 1
        console.log("Player 1 begin, 2 times same num !")
      }
    }
  }

  // quand le joueur selectionner une carte 
  // on regarde si il peut jouer une carte de la priority zone 
  // on prend le slot prioritaire du joueur on regarde la carte 
  // on regarde si cette carte est jouable sur tout les autres slot 
  canPlayPriorityCard() {
    if (this.selectedCard[0] !== null) {
      console.log("une carte est déjâ séléctionner")
      return false 
    }

    const prioritySlot = (this.active === 1) ? 13 : 23
    if (this.board[prioritySlot] === null ) { 
      return false
    }
    const priorityCard = this.board[prioritySlot].getCard()
    const allSlots = Object.keys(this.board).map(Number); // Convertit en nombres

    // on met la carte en séléction
    this.selectedCard = [priorityCard, prioritySlot]

    // on regarde si la carte peut être jouér 
    for (const slot of allSlots) {
      if (slot !== prioritySlot && this.isPlayable(slot, false)) {
        this.selectedCard = [null, null]
        return true
      }
    }

    this.selectedCard = [null, null]
    return false
  }
  
  // true => selectable card, false => card not selectable
  isSelectable(position) {
    // on a déjà une carte
    if (this.selectedCard[0] !== null && this.selectedCard[1] !== null) {
      console.log("a card is already select")
      return false
    }

    const drawSlot = (this.active === 1) ? 11 : 21

    if (position === drawSlot && this.canPlayPriorityCard()) {
      console.log("la zone prioritaire peut être jouer")
      return false
    }

    // slot où tu pas selec
    if (Board.zones[4].includes(position) || Board.zones[5].includes(position) || [61, 62].includes(position) || [12, 22].includes(position)) {
      console.log("Postion is not selectable")
      return false
    }

    // avant le deb de la partie 
    if (this.active === 0) {
      console.log("no active player")
      return false
    }
    const allSlots = Object.keys(this.board).map(Number); // Convertit en nombres
    if (allSlots.includes(position)) {
      console.log("position hors du tableau")
      return false 
    }

    const isEmptyPosition = (!this.board[position].isEmpty()) ? "" : "la position est vide"
    console.log(isEmptyPosition)  
    return !this.board[position].isEmpty() 
  }

  isPlayable(slot2, verbose = true) {
    // il faut une carte sélectionner
    // if (this.selectedCard[0] === null && this.selectedCard[1] === null) { 
    //  console.log("aucune carte séléctionner")
    //  return false
    //}
  
    const adverseCards = (this.active === 1) ? [21, 23] : [11, 13] 
    const coverCard = this.board[slot2].getCard()
    // on a besoin de savoir les symboles pour les slot possible pour la zone3
    // Board.symbol = ["Spade", "Club", "Diamond", "Heart"]


    // si on veut poser dans la zone 4 ou 5
    if(Board.zones[4].includes(slot2) || Board.zones[5].includes(slot2) ) {
      // si la stack est vide alors on doit poser forcément un as
      if (coverCard === undefined) {
        if (this.selectedCard[0].num === 1) { return true }
        if (verbose) console.log("la place est vide il faut que ce soit un as");
        return false
      } 
      // +1 la carte
      if (this.selectedCard[0].num != coverCard.num + 1) {
        if (verbose) console.log("il faut que ce soit +1 la carte");
        return false 
      } 
      // il faut que ce soit le même symbole
      if (this.selectedCard[0].symbol != coverCard.symbol) { 
        if (verbose) console.log("il faut que ce soit le même symbole");
        return false
      }
      // toute les condition sont validé => true
      console.log("45")
      return true
    
    // si on veut poser dans la zone 3 
    } else if (Board.zones[3].includes(slot2)) {
      // si la stack est vide alors on peut poser n'importe quel carte
      if (coverCard === undefined) { return true }
      // -1 la carte
      if (this.selectedCard[0].num != coverCard.num - 1 ) { 
        if (verbose) console.log("il faut que ce soit -1 la carte");
        return false 
      }  

      const redSymbols = [Board.symbol[2], Board.symbol[3]];
      const isCoverRed = redSymbols.includes(coverCard.symbol);
      const isSelectedRed = redSymbols.includes(this.selectedCard[0].symbol);

      // il faut que ce ne soit pas la même couleur de symbole
      if (isCoverRed === isSelectedRed ) { 
        if (verbose) console.log("il faut que ce ne soit pas la même couleur de symbole");
        return false 
      }
      // toute les condition sont validé => true
      console.log(coverCard)
      console.log(this.selectedCard[0])
      console.log("3")
      return true
    
    // si on veut poser dans la pioche adverse
    } else if (adverseCards.includes(slot2)) {
      // la carte +1 ou -1
      if(coverCard === undefined) { 
        if (verbose) console.log("il faut que il y est une carte pour poser dessus")
        return false 
      }

      // console.log(coverCard)
      // console.log(this.selectedCard[0])

      if (this.selectedCard[0].num != coverCard.num + 1 && this.selectedCard[0].num != coverCard.num - 1) { 
        if (verbose) console.log(" il faut que ce soit +1 ou -1 ");
        return false 
      }        
      // il faut que ce soit le même symbole
      if (this.selectedCard[0].symbol != coverCard.symbol) {
        if (verbose) console.log("Pas le même symoble");
        return false
      }
      // toute les condition sont validé => true
      console.log("adverse")
      return true
    
    // aucun slot valide
    } else {
      return false
    }
  }

  isTransferable(slot2) {
    if (this.selectedCard[0] === null && this.selectedCard[1] === null) { 
      console.log("aucune carte séléctionner")
      return false
    }
    const activePlayerCards =  (this.active === 2) ? [21, 23] : [11, 13]
    const adverseCards = (this.active === 1) ? [21, 23] : [11, 13] 
    if(adverseCards.includes(this.selectedCard[1]) && (Board.zones[3].includes(slot2) || activePlayerCards.includes(slot2))) {
      console.log("if you take the adverse card you have to put in zone up")
      return false 
    } else {
      return true
    }
  }

  isPlayableTransferable(slot2){
    if (!this.isPlayable(slot2)) { 
      console.log("not playable")
      return false 
    }
    if (!this.isTransferable(slot2)) {
      console.log("not transferable")
      return false 
    }
    return true
  }

  selectCard(slot1) {

    // on sauvegarde l'ancien board avec de séléctionner une carte
    this.lastBoard = structuredClone(this.board);

    this.selectedCard = [this.board[slot1].takeCard(), slot1]
    // console.log(this.selectedCard)
  }

  // tansfert card in slot1 in slot 2
  cardTransfer(slot2) {

    // console.log(this.selectedCard[0])
    this.board[slot2].addCard(this.selectedCard[0])
    
    // on met a jour les cartes joué 
    this.lastMoveCard = this.selectedCard[0] 
    this.lastMoveSlot = slot2
    
    // si le slot d'arrivé est dans les zones où on monte on met a jour les cartes qu'on doit monter
    if (Board.zones[4].includes(slot2) || Board.zones[5].includes(slot2)) {
      this.updateCrapetteList(slot2)
    }

    if (this.countSlot12or22 === 1) { this.countSlot12or22 -= 1 } 
    // on vide les cartes sélectionner
    this.selectedCard = [null, null]
  }

  forceCardTransfert(slot1, slot2) {
    let theCard = this.board[slot1].takeCard()
    this.board[slot2].addCard(theCard)
  }

  cancelSelection() {
    if (this.selectedCard[0] !== null && this.selectedCard[1] !== null) {
      const card = this.selectedCard[0];
      const originalSlot = this.selectedCard[1];
      
      this.board[originalSlot].addCard(card);
      this.selectedCard = [null, null];      
      console.log("sélection annulée.");
    } else {
      console.log("aucune carte sélectionner")
    }
  }

  endRound() {
    this.countSlot12or22 = 0;
    if (this.active === 1) {
      this.active = 2
    } else {
      this.active = 1
    }
    // console.log(`au joueurs ${this.active} de jouer `)
  }


  addDrawPile() {
    if (this.countSlot12or22 === 0) {
      if (this.active === 1) {
        this.forceCardTransfert(12, 11)
      } else {
        this.forceCardTransfert(22, 21)
      }
      console.log("Carte tiré")
      this.countSlot12or22 += 1
    } else {
      console.log("Tu n'as plus le droit de tirer une carte")
    }
  }
  


  updateCrapetteList(slot2) {
    let updateCard = this.board[slot2].getCard()
    let nextExpectedCard = structuredClone(updateCard);
    
    nextExpectedCard.num++;

    this.crapetteSources[slot2] = nextExpectedCard;
  }

  findCrapetteMoves() {
    let cardsToMove = [];
    let targetSlots = [];

    const crapetteSlots = Object.keys(this.crapetteSources);
    const boardSlots = Object.keys(this.lastBoard);
    for (const lastBoardSlot of boardSlots) {
      const stack = this.lastBoard[lastBoardSlot].listCard;
      
      // on vérifie que la pile n'est pas vide
      if (!stack || stack.length === 0) continue;

      // on prend la carte du dessus (la première du tableau)
      const candidateCard = stack[0];
      // console.log(stack)
      // console.log(candidateCard)
      // on compare cette carte avec chaque slot de prioritySources
      for (const crapetteSourcesSlot of crapetteSlots) {
        const currentCardInSlot = this.crapetteSources[crapetteSourcesSlot]; // Souvent null au début
        if (currentCardInSlot === null && candidateCard.num === 1) { 
          cardsToMove.push(candidateCard);
          targetSlots.push(crapetteSourcesSlot);
          continue;
        }  

        if (currentCardInSlot === null) { continue }
        // c'est ici que tu définis ta règle du jeu
        if (candidateCard.num === currentCardInSlot.num && candidateCard.symbole === currentCardInSlot.symbole) {
            
          cardsToMove.push(candidateCard);
          targetSlots.push(crapetteSourcesSlot);
        }
      }
    }

    return { cardsToMove, targetSlots };
  }


  isCrapette() {
    // on récupére les card qu'on doit move et dans quel slot on doit les mettre
    const { cardsToMove, targetSlots } = this.findCrapetteMoves();

    // On vérifie si on a une carte a monté 
    if (cardsToMove.length === 0) { return false }
    
    
    // on vérifie si le joueurs ne l'a pas juste remis dans ça pioche 
    const playerCards = (this.active === 1) ? [11, 13] : [21, 23] 
    if (playerCards.includes(this.lastMoveSlot)) { return false }

    // on regarde si le dernier move était dans la zone5 ou 4 
    if (Board.zones[4].includes(this.lastMoveSlot) || Board.zones[5].includes(this.lastMoveSlot) ) { return false }
    else { return true }
  }
}