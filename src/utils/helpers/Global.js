/////HELPER FUNCTIONS
//Check and display the play won
export function checkEndGame(acePile) {
    let counter = 0;
    acePile.forEach((pile) => {
        if (pile.length === 13) {
            counter += 1;
        } else {
            return false;
        }
    });

    if (counter === 4) {
        return true;
    }
}


//Checks one card against another if it's 1 less and opposite color
export function checkOppositeColor(firstCard, secondCard) {
    if (firstCard.color !== secondCard[secondCard.length - 1].color) {
        if (firstCard.number - secondCard[secondCard.length - 1].number === -1) {
            return true;
        }
    }

}

export function handleReset(setPiles, setAcePile, setShuffledDeck, setResetGame, setEndGame) {
    setPiles([[], [], [], [], [], []]);
    setAcePile([[], [], [], []]);
    setShuffledDeck([]);
    setResetGame(resetGame => !resetGame);
    setEndGame(false);
}