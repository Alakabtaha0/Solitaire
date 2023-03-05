import React, { useState, useRef } from 'react'
import InitGame from './InitializeGame.js/InitGame';
import PlayingField from './Playing Field/PlayingField';
import MenuBar from '../Components/MenuBar/MenuBar';
import { GameContext } from '../context';
import { cardSelect, updateGameState, removeCardsFromPiles } from '/Users/vipnumbers/Desktop/Projects/solitaire/src/utils/helpers/Movement.js';
import { removeCard } from '../utils/helpers/ShuffledDeckUtils';
import { checkEndGame } from '../utils/helpers/ShuffledDeckUtils';
import "./Game.css";

function Game() {
    const [resetGame, setResetGame] = useState(false);
    const [currentCard, setCurrentCard] = useState(51);
    const [shuffledDeck, setShuffledDeck] = useState([]);
    const [piles, setPiles] = useState([[], [], [], [], [], []]);
    const [acePile, setAcePile] = useState([[], [], [], []]);
    const [firstCardSelected, setFirstCardSelected] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(true); // This is just to force an update when I don't want anything else to update
    const deckRef = useRef(false);


    function selectCard(e) {
        const s = cardSelect(e.target, piles, setForceUpdate);
        if (s === undefined) {
            return;
        }

        let selectedCard, selectedCards, selectedPile, selectedAcePile, selectedCardKey;
        let pos = s.pos;

        if (s.deck && firstCardSelected === null) {
            //code for selecting card in shuffled deck
            selectedCardKey = s.selectedCardKey;
            selectedCard = shuffledDeck.find(card => card.key === selectedCardKey);
            selectedCard.selected = !selectedCard.selected;
            setFirstCardSelected([selectedCard]);
            return;
        } else {
            selectedPile = s.selectedPile;
            selectedAcePile = acePile[s.selectedAcePile];
            selectedCard = selectedPile[pos];

        }

        //adding cards to Ace Pile
        if ((selectedAcePile !== undefined && selectedAcePile.length !== 0) && firstCardSelected.length === 1) {
            if (firstCardSelected[0].number - 1 === selectedAcePile[selectedAcePile.length - 1].number
                && firstCardSelected[0].suit === selectedAcePile[selectedAcePile.length - 1].suit) {
                selectedAcePile.push(...firstCardSelected);
                removeCardsFromPiles(firstCardSelected, piles);
                shuffledDeck.forEach((card) => {
                    if (card.key === firstCardSelected[0].key) {
                        removeCard(shuffledDeck, firstCardSelected[0], setShuffledDeck, currentCard, setCurrentCard);
                    }
                })
                updateGameState(firstCardSelected, setFirstCardSelected);
                checkEndGame(acePile);
                return;
            }
        } else if (selectedPile.length > 0 && selectedCard.hidden === false) {
            if (firstCardSelected === null) {
                // Select all cards below the clicked one
                selectedCards = selectedPile.slice(pos).filter(card => !card.hidden);
                selectedCards.forEach(card => card.selected = !card.selected);
                setFirstCardSelected([...selectedCards]);
            } else {
                try {

                    //Card to be added
                    //check if it's the final card in the pile
                    if (selectedCard === selectedPile[selectedPile.length - 1]) {
                        //check if the first card in the array is less than 1 and opposite color
                        if ((firstCardSelected[0].number + 1 === selectedCard.number) && (firstCardSelected[0].color !== selectedCard.color)) {
                            selectedPile.push(...firstCardSelected);
                            piles.forEach((currentPile) => {
                                if (currentPile[0] === selectedPile[0]) {
                                    currentPile.push(...firstCardSelected);
                                }

                                //remove from the pile
                                for (let j = 0; j < currentPile.length; j++) {
                                    if (firstCardSelected[0] === currentPile[j]) {
                                        currentPile.splice(j, firstCardSelected.length);
                                        break;
                                    }
                                }
                            });
                            shuffledDeck.forEach((card) => {
                                if (card.key === firstCardSelected[0].key) {
                                    removeCard(shuffledDeck, firstCardSelected[0], setShuffledDeck, currentCard, setCurrentCard);
                                }
                            })
                            acePile.forEach((pile) => {
                                pile.forEach(card => {
                                    if (card.key === firstCardSelected[0].key) {
                                        pile.pop();
                                    }
                                })
                            })
                        }
                    }
                } catch (err) {
                    //pass
                }
                updateGameState(firstCardSelected, setFirstCardSelected);
            }
        } else if (selectedPile.length === 0 && firstCardSelected !== null) {
            // We've confirmed that there's no card here. So we can put Kings or Ace's
            if (firstCardSelected[0].value === "K" && selectedAcePile === undefined) {
                let tempCards = [...firstCardSelected];
                let tempPiles = [...piles];
                piles.forEach((pile) => {
                    if (pile === selectedPile) {
                        tempPiles[piles.indexOf(pile)] = tempCards;
                        shuffledDeck.forEach((card) => {
                            if (card.key === firstCardSelected[0].key) {
                                removeCard(shuffledDeck, firstCardSelected[0], setShuffledDeck, currentCard, setCurrentCard);
                            }
                        });
                    }
                })
                setPiles(tempPiles);
                removeCardsFromPiles(firstCardSelected, piles);

            }
            if (firstCardSelected[0].value === "A" && firstCardSelected.length === 1) {
                selectedAcePile?.push(...firstCardSelected);
                removeCardsFromPiles(firstCardSelected, piles);
                shuffledDeck.forEach((card) => {
                    if (card.key === firstCardSelected[0].key) {
                        removeCard(shuffledDeck, firstCardSelected[0], setShuffledDeck, currentCard, setCurrentCard);
                    }
                })
            }
            updateGameState(firstCardSelected, setFirstCardSelected);
        }
    }






    return (
        <GameContext.Provider value={{
            currentCard, setCurrentCard,
            shuffledDeck, setShuffledDeck,
            piles, setPiles,
            acePile, setAcePile,
            firstCardSelected, setFirstCardSelected,
            forceUpdate, setForceUpdate,
            deckRef, resetGame, setResetGame
        }} >
            <>
                <MenuBar />
                <InitGame />

                <PlayingField selectCard={selectCard} />


            </>
        </GameContext.Provider >
    )
}

export default Game;
