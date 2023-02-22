import React, { useState, useEffect, useRef } from "react";
import Card from './Card/Card.js';
import AcePiles from "./AcePIles/AcePiles.js";
import Piles from "./Piles/PIles.js";
import './Deck.css';
import PlayingCard from '/Users/vipnumbers/Desktop/Projects/solitaire/src/images/Back of playing card.jpeg';

//// WHAT I NEED TO DO TOMORROW:::
/**What needs to be done
 *  REFACTOR CODE
 *  When doing the clicking, push a card onto the Ace Pile
 *  Clean Up CSS 
 *  Sort out the Ace Piles -- DONE
 *  You need to do the selection (one click and double click) -- DONE
 *  Debug and test
 *  Uncaught TypeError: Cannot read properties of undefined (reading 'key') Deck.js:216 
 *  Uncaught TypeError: Cannot read properties of undefined (reading 'key') Card.js:25 
 * 
 */

export default function Deck() {
    const [currentCard, setCurrentCard] = useState(51);
    const [shuffledDeck, setShuffledDeck] = useState([]);
    const [piles, setPiles] = useState([[], [], [], [], [], []]);
    const [acePile, setAcePile] = useState([[], [], [], []]);
    const [firstCardSelected, setFirstCardSelected] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(true); // This is just to force an update when I don't want anything else to update
    const deckRef = useRef(false);



    //Creating the initial Deck
    function createDeck() {
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
    function dealCards() {
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

    useEffect(() => {
        createDeck();
    }, [])

    if (shuffledDeck.length === 52) {
        deckRef.current = true
    }
    useEffect(() => {
        if (deckRef.current === true) {
            dealCards();
            deckRef.current = false;
            setCurrentCard(shuffledDeck.length - 1);
        }
    });



    //Adding cards from Shuffled Decks to Piles
    function addToPile(currentCard) {
        console.log(currentCard);
        
        //Push from deck to Ace Pile
        if (currentCard.value === "A") {
            let tempAcePile = [...acePile];
            for (let i = 0; i < tempAcePile.length; i++) {
                if (tempAcePile[i].length === 0) {
                    tempAcePile[i].push(currentCard);
                    removeCard(shuffledDeck, currentCard);
                    decreaseCurrentCard();
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
                if ((currentCard.number === finalCard.number + 1) && (currentCard.suit === finalCard.suit)) {
                    tempAcePile[i].push(currentCard);
                    removeCard(shuffledDeck, currentCard);
                    decreaseCurrentCard();
                    setAcePile(tempAcePile);
                    checkEndGame();
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
                    if (currentCard.value === "K") {
                        currentPile.push(currentCard);
                        removeCard(shuffledDeck, currentCard);
                        break;
                    }
                }
                if (checkOppositeColor(currentCard, currentPile)) {
                    currentPile.push(currentCard)
                    removeCard(shuffledDeck, currentCard)
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

    //Move cards between piles
    function moveCardsBetweenPiles(e) {
        let s = cardSelect(e.target);
        let pos, selectedPile, selectedCard;
        if (s === undefined) {
            return;
        }

        pos = s.pos;
        selectedPile = s.selectedPile;
        selectedCard = selectedPile[pos];



        //Add other card to Ace Pile
        if (selectedCard?.key === selectedPile[selectedPile.length - 1]?.key) { //A check to see if the final card was the one picked - Saves time
            let tempAcePile = [...acePile];
            tempAcePile.forEach((acePile) => {
                var finalAceCard = acePile[acePile.length-1];
                if (finalAceCard !== undefined) {
                    if ((selectedCard?.number === finalAceCard.number +1) && (selectedCard.suit === finalAceCard.suit)) {
                        acePile.push(selectedCard);
                        selectedPile.pop();
                        setAcePile(tempAcePile);
                        checkEndGame();
                        return;
                    }
                }
            })
        }


        //Make Array from Clicked Card Position
        let tempPileArray = selectedPile.slice(pos);
        //Pushing the new spliced pile into a new Pile
        let tempPiles = [...piles]
        for (let i = 0; i < tempPiles.length; i++) {
            let currentPile = tempPiles[i]
            try {
                //Adding Cards to blank spot -- King
                if (currentPile.length === 0) {
                    if (selectedCard.value === "K") {
                        currentPile.push(...tempPileArray);
                        selectedPile.splice(pos, tempPileArray.length);
                        break;
                    }
                }
                //Push Ace into AcePile array
                if (selectedCard.value === "A" && selectedPile[selectedPile.length - 1] === selectedCard) {
                    let tempAcePile = [...acePile];
                    for (let i = 0; i < tempAcePile.length; i++) {
                        if (tempAcePile[i].length === 0) {
                            tempAcePile[i].push(selectedPile[selectedPile.length - 1]);
                            selectedPile.pop();
                            break;
                        }
                    }
                    setPiles(tempPiles);
                    setAcePile(tempAcePile);
                    return;
                }

                if (checkOppositeColor(tempPileArray[0], currentPile)) {
                    currentPile.push(...tempPileArray)
                    selectedPile.splice(pos, tempPileArray.length);
                    break;
                }

            } catch (err) {
                //pass
            }

        }
        setPiles(tempPiles)
    }




    function selectCard(e) {
        const s = cardSelect(e.target);
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
                removeCardsFromPiles(firstCardSelected);
                shuffledDeck.forEach((card) => {
                    if (card.key === firstCardSelected[0].key) {
                        removeCard(shuffledDeck, firstCardSelected[0]);
                    }
                })
                updateGameState();
                checkEndGame();
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
                                    removeCard(shuffledDeck, firstCardSelected[0]);
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
                updateGameState();
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
                                removeCard(shuffledDeck, firstCardSelected[0]);
                            }
                        });
                    }
                })
                setPiles(tempPiles);
                removeCardsFromPiles(firstCardSelected);
                
            }
            if (firstCardSelected[0].value === "A" && firstCardSelected.length === 1) {
                selectedAcePile?.push(...firstCardSelected);
                removeCardsFromPiles(firstCardSelected);
                shuffledDeck.forEach((card) => {
                    if (card.key === firstCardSelected[0].key) {
                        removeCard(shuffledDeck, firstCardSelected[0]);
                    }
                })
            }
            updateGameState();
        }
    }


    //Moving card back to the game from the ace pile
    function moveBackToGame(e) {
        const s = cardSelect(e.target);
        if (s === undefined) {
            return;
        }

        let selectedAcePile = acePile[s.selectedAcePile];
        let selectedCard = selectedAcePile[selectedAcePile.length - 1];

        selectedCard.selected = !selectedCard.selected;
        setFirstCardSelected([selectedCard]);
        return;
    }


    /////HELPER FUNCTIONS
    //Check and display the play won
    function checkEndGame() {
        let counter = 0;
        acePile.forEach((pile) => {
            if (pile.length === 13) {
                counter += 1;
            } else {
                return;
            }
        });

        if (counter === 4) {
            alert('Congratulations! You Win!');
        }
    }

    //Checks one card against another if it's 1 less and opposite color
    function checkOppositeColor(firstCard, secondCard) {
        if (firstCard.color !== secondCard[secondCard.length - 1].color) {
            if (firstCard.number - secondCard[secondCard.length - 1].number === -1) {
                return true;
            }
        }

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

    //Removes the cards from play
    function removeCardsFromPiles(cardsToRemove) {
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

    //Force a update of the game state
    function updateGameState() {
        setForceUpdate(!forceUpdate);
        //reset the red-border
        firstCardSelected.forEach(card => card.selected = !card.selected)
        setFirstCardSelected(null);
        return;
    }

    //Move to next card in shuffled deck
    function decreaseCurrentCard() {
        let nextCard = shuffledDeck[currentCard - 2]
        if (nextCard === undefined && shuffledDeck.length > 1) {
            setCurrentCard(shuffledDeck.length - 1)
        } else {
            setCurrentCard(currentCard - 1);
        }
    }

    //Removes cards from Shuffled Deck 
    function removeCard(deck, cardToRemove) {
        let tempDeck = [...deck];
        let newShuffledDeck = [];
        for (let i = 0; i < tempDeck.length; i++) {
            if (tempDeck[i] !== cardToRemove) {
                newShuffledDeck.push(tempDeck[i]);
            }
        }
        decreaseCurrentCard();
        setShuffledDeck(newShuffledDeck);
    }

    //Get the card info when clicking on a card
    function cardSelect(clickedCard) {
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
            setForceUpdate(!forceUpdate);
            return;
        }

        const pos = selectedPile.findIndex(card => card.key === selectedCardKey);
        return { pos, selectedPile, selectedCardKey, selectedAcePile, deck };
    }

    return (
        <div className="game-layout">
            <div className="ace-pile-spot">
                <div className="ace-pile-layout">
                    {
                        acePile.map((pile, i) => {
                            return <AcePiles pile={pile} onOnePress={firstCardSelected === null ? moveBackToGame : selectCard} i={i} key={i} />
                        })
                    }
                </div>
            </div>
            <div className="card-layout">
                <div className="card" onClick={decreaseCurrentCard} >
                    <img className='back-card' src={PlayingCard} alt='playing card'></img>
                </div>

                {shuffledDeck.length > 0 && <Card onOnePress={selectCard} card={shuffledDeck[currentCard]} onDoublePress={clickShuffledDeck} />}
                {
                    piles.map((pile, i) => {
                        return <Piles
                            piles={pile}
                            key={i}
                            i={i}
                            pileClick={moveCardsBetweenPiles}
                            cardClick={moveCardsBetweenPiles}
                            onOnePress={selectCard} />
                    })
                }
            </div>

        </div>
    )

}