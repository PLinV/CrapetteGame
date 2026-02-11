import { Pack } from "../type/Pack.js";
import { Card } from "../type/Card.js";
import { Player } from "../type/Player.js";
import { Board } from "../type/Board.js";


let listCard1 = []
let listCard2 = []
for (const symbol of ["Spade", "Club", "Diamond", "Heart"]) {
    for (let i = 1; i < 14; i++) {
    listCard1.push(new Card(0, symbol, i))
    }
} 

for (const symbol of ["Spade", "Club", "Diamond", "Heart"]) {
    for (let i = 1; i < 14; i++) {
    listCard2.push(new Card(1, symbol, i))
    }
} 

let pack1 = new Pack(listCard1)
let pack2 = new Pack(listCard2)

console.log(pack1)
pack1.shuffle()
console.log(pack1)


let selecCard = pack1.takeCard()
pack2.addCard(selecCard)
console.log(pack1)
console.log(pack2)
