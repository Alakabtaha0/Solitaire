//Get the card info when clicking on a card
export function cardSelect(clickedCard, piles, setForceUpdate) {
    const pileNumber = findDataAttribute(clickedCard, 'pilArrNum');
    const selectedAcePile = findDataAttribute(clickedCard, 'acePilArrNum');
    const selectedCardKey = Number(findDataAttribute(clickedCard, 'cardNum'));
    const selectedPile = piles[pileNumber] || [];
    let deck;

    if (pileNumber === true) {
        deck = true;
    } else {
        deck = false;
    }

    if (selectedCardKey === 1 && selectedPile[selectedPile.length - 1]?.hidden) {
        selectedPile[selectedPile.length - 1].hidden = false;
        setForceUpdate(forceUpdate => !forceUpdate);
        return;
    }

    const pos = selectedPile.findIndex(card => card.key === selectedCardKey);
    return { pos, selectedPile, selectedCardKey, selectedAcePile, deck };
}

 //find the data attribute you want
 function findDataAttribute(sel, attribute) {
    try {
        if (sel.dataset[attribute] === undefined) {
            return findDataAttribute(sel.parentNode, attribute);
        } else {
            return sel.dataset[attribute];
        }
    } catch (err) {
        return true;
    }
}

//Force a update of the game state
export function updateGameState(firstCardSelected, setFirstCardSelected) {
    //reset the red-border
    firstCardSelected.forEach(card => card.selected = !card.selected)
    setFirstCardSelected(null);
    return;
}

 //Removes the cards from play
 export function removeCardsFromPiles(cardsToRemove, piles) {
    for (let i = 0; i < piles.length; i++) {
        const currentPile = piles[i];
        for (let j = 0; j < currentPile.length; j++) {
            if (cardsToRemove[0] === currentPile[j]) {
                currentPile.splice(j, cardsToRemove.length);
                return;
            }
        }
    }
}