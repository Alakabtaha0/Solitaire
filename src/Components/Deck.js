import { click } from "@testing-library/user-event/dist/click.js";
import React, { useState, useEffect, useRef } from "react";
import Card from './Card/Card.js';
import AcePiles from "./AcePIles/AcePiles.js";
import Piles from "./Piles/PIles.js";
import './Deck.css';

//// WHAT I NEED TO DO TOMORROW:::
/**What needs to be done
 *  Clean Up CSS 
 *  Sort out the Ace Piles
 *  Debug and test
 */
export default function Deck() {
    const [currentCard, setCurrentCard] = useState(51);
    const [shuffledDeck, setShuffledDeck] = useState([]);
    const [piles, setPiles] = useState([[], [], [], [], [], [], []]);
    const [acePile, setAcePile] = useState([[], [], [], []]);
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
                deck.push({ key: k, value: pushValue, suit: suits[j], number: i, hidden: false, color: suits[j] === "♦" ? "red" : suits[j] === "♥" ? 'red' : "black" });
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
        for (let i = 1; i <= newPiles.length - 1; i++) {
            let finalIteration = i + 1;
            //adding the cards / adding the number of cards
            for (let j = 0; j < i; j++) {
                //add to the pile and remove the final card from the deck
                let topCard = shuffledDeck.pop();
                if (finalIteration === 2) {
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

    //Adding cards from Shuffled Decks to Piles
    function addToPile(currentCard) {
        let tempPiles = [...piles];

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
        for (let i=0; i < tempAcePile.length; i++ ) {
            let finalCard = tempAcePile[i][tempAcePile[i].length -1];
            if(finalCard === undefined) {
                continue;
            } else {
                if((currentCard.number === finalCard.number+1) && (currentCard.suit === finalCard.suit)) {
                    tempAcePile[i].push(currentCard);
                    removeCard(shuffledDeck,currentCard);
                    decreaseCurrentCard();
                    setAcePile(tempAcePile);
                    return;
                }
            }
        }
    
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




    function moveCardsBetweenPiles(e) {
        let pileNumber = findPileNumber(e.target);
        let selectedCardKey = Number(findCardNumber(e.target));
        let selectedPile = piles[pileNumber];
        let pos = 0;

        //clicking a hidden card will no longer make the card hidden
        if (selectedCardKey === 1 && selectedPile[selectedPile.length - 1].hidden === true) {
            selectedPile[selectedPile.length - 1].hidden = false;
            setForceUpdate(!forceUpdate);
        }


        //Finds the position in the Pile Array
        for (pos; pos < selectedPile.length; pos++) {
            if (selectedCardKey === selectedPile[pos].key) {
                break;
            }
        }

        //Add other card to Ace Pile
        if(selectedCardKey === selectedPile[selectedPile.length-1].key) { //A check to see if the final card was the one picked - Saves time
            let clickedCard = selectedPile[selectedPile.length-1];
            let tempAcePile = [...acePile];
            for (let i=0; i < tempAcePile.length; i++ ) {
                let finalAceCard = tempAcePile[i][tempAcePile[i].length -1];
                if(finalAceCard === undefined) {
                    continue;
                } else {
                    if((clickedCard.number === finalAceCard.number+1) && (clickedCard.suit === finalAceCard.suit)) {
                        tempAcePile[i].push(clickedCard);
                        selectedPile.pop();
                        setAcePile(tempAcePile);
                        return;
                    }
                }
            }
        }
       

        //Make Array from Clicked Card Position
        let tempPileArray = [];
        let r = pos;
        for (r; r < selectedPile.length; r++) {
            tempPileArray.push(selectedPile[r])
        }


        //Pushing the new spliced pile into a new Pile
        let tempPiles = [...piles]
        for (let i = 0; i < tempPiles.length; i++) {
            let currentPile = tempPiles[i]
            try {
                //Adding Cards to blank spot -- King
                if (currentPile.length === 0) {
                    if (tempPileArray[0].value === "K") {
                        currentPile.push(...tempPileArray);
                        selectedPile.splice(pos, tempPileArray.length);
                        break;
                    }
                }
                //Push Ace into AcePile array
                if (selectedCardKey <= 4 && selectedPile[selectedPile.length - 1].key === selectedCardKey) {
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

                /*
                if (canGoToAce) {
                    let tempAcePile = [...acePile];
                    for (let i = 0; i < tempAcePile.length; i++) {
                        let finalCardInPile = tempAcePile[i][tempAcePile[i].length - 1]
                        if (finalCardInPile.key + 4 === selectedCardKey) {
                            tempAcePile[i].push(selectedPile[selectedPile.length - 1]);
                            selectedPile.pop();
                            break;
                        }
                    }
                    setAcePile(tempAcePile);
                    setPiles(tempPiles);
                    return;
                }*/
            } catch (err) {
                //pass
            }

        }
        setPiles(tempPiles)
    }


    //Checks one card against another if it's 1 less and opposite color
    function checkOppositeColor(firstCard, secondCard) {
        if (firstCard.color !== secondCard[secondCard.length - 1].color) {
            if (firstCard.number - secondCard[secondCard.length - 1].number === -1) {
                return true;
            }
        }

    }

    //Find which pile was clicked
    function findPileNumber(sel) {
        if (sel.dataset.pilArrNum === undefined) {
            return findPileNumber(sel.parentNode);
        } else {
            return sel.dataset.pilArrNum;
        }
    }

    //Find the clicked card key
    function findCardNumber(sel) {
        try {
            if (sel.dataset.cardNum === undefined) {
                return findCardNumber(sel.parentNode);
            } else {
                return sel.dataset.cardNum;
            }
        } catch (err) {
            return true;
        }
    }


    return (
        <div className="game-layout">
            <div className="ace-pile-spot">
                <div className="ace-pile-layout">
                    {
                        acePile.map((pile, cn) => {
                            return <AcePiles pile={pile} cn={cn} />
                        })
                    }
                </div>
            </div>
            <div className="card-layout">
                <div className="">
                    {shuffledDeck.length > 0 && <Card onPress={clickShuffledDeck} card={shuffledDeck[currentCard]} />}

                    <button onClick={decreaseCurrentCard} >Next Card</button>

                </div>
                {
                    piles.map((pile, i) => {
                        return <Piles piles={pile} i={i} pileClick={moveCardsBetweenPiles} cardClick={moveCardsBetweenPiles} />
                    })
                }
            </div>

        </div>
    )
}