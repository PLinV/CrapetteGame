export class Card { 

    constructor(color, symbol, num){
        this.color = color
        this.symbol = symbol
        this.num = num
    }

    toString() {
        if (this.num === undefined || this.symbol === undefined) {
            return "[ ⚠️ Carte Invalide ]";
        }
        
        // 1. Dictionnaire pour transformer les chiffres en Noms
        const noms = {
            1: "As",
            11: "Valet",
            12: "Dame",
            13: "Roi"
        };

        // 2. Dictionnaire pour mettre des icônes (optionnel mais plus joli)
        const icones = {
            "Heart": "♥",    // Coeur
            "Diamond": "♦",  // Carreau
            "Club": "♣",     // Trèfle
            "Spade": "♠"     // Pique
        };

        // Astuce : "noms[this.num] || this.num" veut dire :
        // "Prends le nom s'il existe (ex: Valet), sinon garde le chiffre normal (ex: 7)"
        const affichageNum = noms[this.num] || this.num;
        
        // Pareil pour l'icône, si le symbole n'est pas trouvé, on affiche le texte complet
        const affichageSymbole = icones[this.symbol] || this.symbol;

        // On retourne une chaîne propre : ex "[ As ♥ ]" ou "[ 7 ♠ ]"
        return `[ ${affichageNum} ${affichageSymbole} ]`;
    }
}