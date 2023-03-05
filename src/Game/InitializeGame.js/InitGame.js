import React, {useEffect, useContext} from 'react';
import { dealCards, createDeck } from '../../utils/initializeGame';
import { GameContext } from '../../context';


function InitGame() {
    const {shuffledDeck, setShuffledDeck} = useContext(GameContext);
    const {piles, setPiles} = useContext(GameContext);
    const {deckRef} = useContext(GameContext);
    const { setCurrentCard} = useContext(GameContext);
    const {resetGame} = useContext(GameContext);

    useEffect(() => {
        createDeck(setShuffledDeck);
    }, [resetGame])

    if (shuffledDeck.length === 52) {
        deckRef.current = true
    }
    useEffect(() => {
        if (deckRef.current === true) {
            dealCards(setPiles, piles, shuffledDeck);
            deckRef.current = false;
            setCurrentCard(shuffledDeck.length - 1);
        }
    });

    return (
        <div>

        </div>
    )
}

export default InitGame
