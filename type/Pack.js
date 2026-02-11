export class Pack {

    constructor(listCard) {
        this.listCard = listCard
    } 

    shuffle() {
        for (let i = this.listCard.length - 1; i > 0; i--) {
        
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.listCard[i];
            this.listCard[i] = this.listCard[j];
            this.listCard[j] = temp;
        }
    }

    isEmpty() {
        return this.listCard.length === 0
    }

    getCard() {
        return this.listCard[0]
    }

    takeCard() {
        return this.listCard.shift()
    }

    addCard(card) {
        this.listCard.unshift(card)
    }
}