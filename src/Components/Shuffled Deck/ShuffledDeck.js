import React, { useContext } from 'react'
import PlayingCard from '/Users/vipnumbers/Desktop/Projects/solitaire/src/images/Back of playing card.jpeg';
import Card from '../Card/Card';
import './ShuffledDeck.css';
import { removeCard, decreaseCurrentCard, checkOppositeColor } from '../../utils/helpers/ShuffledDeckUtils';
import { checkEndGame } from '../../utils/helpers/Global';
import { GameContext } from '../../context';

function ShuffledDeck({ selectCard }) {
    const { shuffledDeck, setShuffledDeck } = useContext(GameContext);
    const { piles, setPiles } = useContext(GameContext);
    const { acePile, setAcePile } = useContext(GameContext);
    const { currentCard, setCurrentCard } = useContext(GameContext);
    const {setEndGame} = useContext(GameContext);
    
    //Adding cards from Shuffled Decks to Piles
    function addToPile(selectedCard) {

        //Push from deck to Ace Pile
        if (selectedCard.value === "A") {
            let tempAcePile = [...acePile];
            for (let i = 0; i < tempAcePile.length; i++) {
                if (tempAcePile[i].length === 0) {
                    tempAcePile[i].push(selectedCard);
                    removeCard(shuffledDeck, selectedCard, setShuffledDeck, currentCard, setCurrentCard);
                    decreaseCurrentCard(shuffledDeck, currentCard, setCurrentCard);
                    break;
                }
            }
            setAcePile(tempAcePile);
            return;
        }


        //Add different cards to Ace Pile
        let tempAcePile = [...acePile];
        for (let i = 0; i < tempAcePile.length; i++) {
            let finalCard = tempAcePile[i][tempAcePile[i].length - 1];
            if (finalCard === undefined) {
                continue;
            } else {
                if ((selectedCard.number === finalCard.number + 1) && (selectedCard.suit === finalCard.suit)) {
                    tempAcePile[i].push(selectedCard);
                    removeCard(shuffledDeck, selectedCard, setShuffledDeck, currentCard, setCurrentCard);
                    decreaseCurrentCard(shuffledDeck, currentCard, setCurrentCard);
                    setAcePile(tempAcePile);
                    setEndGame(checkEndGame(acePile));
                    return;
                }
            }
        }

        let tempPiles = [...piles];

        //Push regular card to pile stack
        for (let i = 0; i < tempPiles.length; i++) {
            let currentPile = tempPiles[i]
            try {
                //Adding card to blank spot -- King
                if (currentPile.length === 0) {
                    if (selectedCard.value === "K") {
                        currentPile.push(selectedCard);
                        removeCard(shuffledDeck, selectedCard, setShuffledDeck, currentCard, setCurrentCard);
                        break;
                    }
                }
                if (checkOppositeColor(selectedCard, currentPile)) {
                    currentPile.push(selectedCard)
                    removeCard(shuffledDeck, selectedCard, setShuffledDeck, currentCard, setCurrentCard);
                    break;
                }

            } catch (err) {
                //pass
            }
        }
        setPiles(tempPiles)
    }

    //This is to move a card from shuffled deck to the playing fields/Piles
    function clickShuffledDeck(e) {
        let cardInfo = shuffledDeck[currentCard];
        addToPile(cardInfo)
    }

    return (
        <div className='shuffled-deck-layout'>
            <div className="card" onClick={() => decreaseCurrentCard(shuffledDeck, currentCard, setCurrentCard)} >
                {shuffledDeck.length > 0 ? <img className='back-card' src={PlayingCard} alt='playing card'></img> : <div></div>}
            </div>
            {
                shuffledDeck.length > 0 && (!shuffledDeck[currentCard] ?
                    () => decreaseCurrentCard(shuffledDeck, currentCard, setCurrentCard) :
                    <Card onOnePress={selectCard} card={shuffledDeck[currentCard]} onDoublePress={clickShuffledDeck} />)
            }
        </div>

    )
}

export default ShuffledDeck;
