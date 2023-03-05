//Creating the initial Deck
export function createDeck(setShuffledDeck) {
    const suits = ["♥", "♠", "♦", "♣"];
    let deck = [];
    let k = 0;

    //Suits
    for (let i = 1; i < 14; i++) {
        //suit
        for (let j = 0; j < 4; j++) {
            //Check if value or number
            let pushValue;
            if (i === 1) {
                pushValue = "A";
            } else if (i === 13) {
                pushValue = "K"
            } else if (i === 12) {
                pushValue = "Q"
            } else if (i === 11) {
                pushValue = "J"
            } else {
                pushValue = i;
            }
            deck.push({ key: k, selected: false, value: pushValue, suit: suits[j], number: i, hidden: false, color: suits[j] === "♦" ? "red" : suits[j] === "♥" ? 'red' : "black" });
            k++;
        }
    }

    //Shuffle Deck
    let tempShuffledDeck = [];
    for (let i = 0; i < 52; i++) {
        let rand = Math.floor(Math.random() * deck.length);
        tempShuffledDeck.push(deck[rand]);
        deck.splice(deck.indexOf(deck[rand]), 1)
    }
    setShuffledDeck(tempShuffledDeck);
}


//set the cards in the piles at game initialization
export function dealCards(setPiles, piles, shuffledDeck ) {
    let newPiles = [...piles];
    for (let i = 0; i < newPiles.length; i++) {
        let finalIteration = i;
        //adding the cards / adding the number of cards
        for (let j = 0; j < i + 1; j++) {
            //add to the pile and remove the final card from the deck
            let topCard = shuffledDeck.pop();
            if (finalIteration === 0) {
                topCard.hidden = false;
            } else {
                topCard.hidden = true;
            }
            newPiles[i].push(topCard);
            finalIteration -= 1;
        }
    }
    setPiles(newPiles);
}