import { Pack } from "../type/Pack.js";
import { Card } from "../type/Card.js";
import { Player } from "../type/Player.js";
import { Board } from "../type/Board.js";

let board = new Board("Anna", "Paulin") 
board.initGame()
console.log(board.toString())

board.isSelectable(23)
board.selectCard(23)
board.whoBegins()
console.log(board.active)
console.log("23 => 31")
console.log(board.selectedCard[0])
console.log(board.isPlayable(31))

if (board.isTransferable(31) && board.isPlayable(31)) {
    board.cardTransfer(31); 
}

console.log(board.lastBoard[23])
console.log(board.toString())

console.log(`y a t'il crapette : ${board.isCrapette()}`)

board.endRound()