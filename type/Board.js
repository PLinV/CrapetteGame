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
    
    // utile pour la crapette 
    this.prioritySources = {
      41 : null,
      42 : null,
      43 : null,
      44 : null,  
      51 : null,
      52 : null,
      53 : null, 
      54 : null
    }
    this.lastMooveCard = null // la dérniere carte jouer
    this.lastMooveSlot = null // le dérnier slot bouger

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
    
    // 1. On récupère toutes les clés (11, 12, 61...) et on les trie
    const keys = Object.keys(this.board);
    
    let currentLine = ""; // Pour repérer quand on change de "ligne" (ex: passage de 10 à 20)

    for (const key of keys) {
      const pack = this.board[key];
      const count = pack.listCard.length;

      // 2. Gestion de l'affichage de la carte du dessus
      // On utilise ta méthode pack.getCard() qui renvoie la carte sans l'enlever
      
      // console.log(key)
      const topCardInfo = (pack.isEmpty()) 
          ? "[     VIDE     ]" 
          : `[ ${pack.getCard().toString()} ]`;

      // 3. Séparateur visuel si on change de ligne (ex: on passe des 30 aux 40)
      if (currentLine !== "" && key[0] !== currentLine) {
        display += "----------------------------------\n";
      }
      currentLine = key[0]; // On met à jour le premier chiffre (1, 2, 3...)

      // 4. Construction de la ligne
      // .padEnd(25) sert à aligner le texte verticalement en ajoutant des espaces
      display += `Slot ${key} : ${topCardInfo.padEnd(25)} (Total: ${count})\n`;
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
    this.lastMooveCard = null
    this.lastMooveCard = null
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

    if (this.active === 1) {
      this.forceCardTransfert(12, 11)
    } else {
      this.forceCardTransfert(22, 21)
    }
  }

  // true => selectable card, false => card not selectable
  isSelectable(position) {
    // on a déjà une carte
    if (this.selectedCard[0] !== null && this.selectedCard[1] !== null) {
      console.log("a card is already select")
      return false
    }

    // slot juste où tu pas selec
    if (Board.zones[4].includes(position) || Board.zones[5].includes(position) || [61, 62].includes(position) || [12, 22].includes(position)) {
      console.log("Postion is not selectable")
      return false
    }

    // avant le deb de la partie 
    if (this.active === 0) {
      console.log("no active player")
      return false
    }


    const isEmptyPosition = (!this.board[position].isEmpty()) ? "" : "la position est vide"
    console.log(isEmptyPosition)  
    return !this.board[position].isEmpty() 
  }

  isPlayable(slot2) {
    // il faut une carte sélectionner
    if (this.selectedCard[0] === null && this.selectedCard[1] === null) { 
      console.log("aucune carte séléctionner")
      return false
    }
  
    const adverseCards = (this.active === 1) ? [21, 23] : [11, 13] 
    const coverCard = this.board[slot2].getCard()
    // on a besoin de savoir les symboles pour les slot possible pour la zone3
    // Board.symbol = ["Spade", "Club", "Diamond", "Heart"]
    let otherSymbole = []
    if (this.selectedCard[0].symbol === Board.symbol[2] || this.selectedCard[0].symbol === Board.symbol[3] ) {
      otherSymbole = [Board.symbol[0], Board.symbol[1]] 
    } else {
      otherSymbole = [Board.symbol[2], Board.symbol[3]]
    }


    // si on veut poser dans la zone 4 ou 5
    if(Board.zones[4].includes(slot2) || Board.zones[5].includes(slot2) ) {
      // si la stack est vide alors on doit poser forcément un as
      if (this.board[slot2].isEmpty()) {
        if (this.selectedCard[0].num === 1) { return true }
        return false
      } 
      // +1 la carte
      if (this.selectedCard[0].num != coverCard.num + 1) { return false } 
      // il faut que ce soit le même symbole
      if (this.selectedCard[0].symbol != coverCard.symbol) {return false}
      // toute les condition sont validé => true
      return true
    
    // si on veut poser dans la zone 3 
    } else if (Board.zones[3].includes(slot2)) {
      // si la stack est vide alors on peut poser n'importe quel carte
      if (this.board[slot2].isEmpty()) { return true }
      // -1 la carte
      if (this.selectedCard[0].num != coverCard.num - 1 ) { return false }  
      // il faut que ce ne soit pas la même couleur de symbole
      if (otherSymbole.includes(this.selectedCard[0].symbol) ) { return false }
      // toute les condition sont validé => true
      return true
    
    // si on veut poser dans la pioche adverse
    } else if (adverseCards.includes(slot2)) {
      // la carte +1 ou -1
      if (this.selectedCard[0].num != coverCard.num + 1 || this.selectedCard[0].num != coverCard.getCard().num - 1) { return false }        
      // il faut que ce soit le même symbole
      if (this.selectedCard[0].symbol != coverCard.symbol) {return false}
      // toute les condition sont validé => true
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
    if (!this.isPlayable(slot2)) { return false }
    if (!this.isTransferable(slot2)) { return false }
  }

  selectCard(slot1) {
    this.selectedCard = [this.board[slot1].takeCard(), slot1]
    // console.log(this.selectedCard)
  }

  // tansfert card in slot1 in slot 2
  cardTransfer(slot2) {
    // console.log(this.selectedCard[0])
    this.board[slot2].addCard(this.selectedCard[0])
    
    if (this.selectedCard[1] === "12") {
      this.forceCardTransfert("12","11")
    } else if (this.selectedCard[1] === "22") {
      this.forceCardTransfert("22", "21")
    }
    
    // on met a jour les cartes joué 
    this.lastMooveCard = this.selectedCard[0] 
    this.lastMooveSlot = slot2
    
    // si le slot d'arrivé est dans les zones où on monte on met a jour les cartes qu'on doit monter
    if (Board.zones[4].includes(slot2) || Board.zones[4].includes(slot2)) {
      this.updatePriorityList()
    }

    // on vide les cartes sélectionner
    this.selectedCard = [null, null]
  }

  forceCardTransfert(slot1, slot2) {
    let theCard = this.board[slot1].takeCard()
    this.board[slot2].addCard(theCard)
  }

  endRound() {
    if (this.active === 1) {
      this.active = 2
    } else {
      this.active = 1
    }
    console.log(`au joueurs ${this.active} de jouer `)
  }

  
  updatePriorityList(slot2) {
    let updateCard = this.board[slot2].getCard()
    updateCard.num++
    this.prioritySources[slot2] = updateCard 
  }

  isCrapette() {
    const slots = Object.keys(this.prioritySources);
    let foundCard = null;
    let foundSlots = []; 

    if (this.lastMooveCard === null ) { return false }

    if (this.lastMooveCard.num === 1 && (!Board.zones[5].includes(this.lastMooveSlot) || !Board.zones[4].includes(this.lastMooveSlot))) {
      for (const slot of slots) {
        if (this.prioritySources[slot] !== null) { return true }
      } 
    } else {

      for (const slot of slots) {
        if (this.prioritySources[slot] === this.lastMooveCard) {
          foundCard = this.prioritySources[slot]
          foundSlots.push(slot)
        }
      }
        
      if (foundCard === null) {
        return false
      } else {
        if (foundSlots.includes(this.lastMooveSlot)) {
          return false 
        } else {
          return true 
        }
      } 
    }
  }
}