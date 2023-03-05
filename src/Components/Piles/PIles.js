import React, { useContext } from "react"
import Card from "../Card/Card"
import { GameContext } from "../../context";
import { checkEndGame, checkOppositeColor } from "../../utils/helpers/Global.js";
import { cardSelect } from "../../utils/helpers/Movement";

//Temp -- will get put into its own component
const Piles = ({ individualPiles, i, onOnePress }) => {
    const {acePile, setAcePile} = useContext(GameContext);
    const {piles, setPiles} = useContext(GameContext);
    const { setForceUpdate} = useContext(GameContext);

    //Move cards between piles
    function moveCardsBetweenPiles(e) {
        let s = cardSelect(e.target, piles, setForceUpdate);
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
                var finalAceCard = acePile[acePile.length - 1];
                if (finalAceCard !== undefined) {
                    if ((selectedCard?.number === finalAceCard.number + 1) && (selectedCard.suit === finalAceCard.suit)) {
                        acePile.push(selectedCard);
                        selectedPile.pop();
                        setAcePile(tempAcePile);
                        checkEndGame(acePile);
                        return;
                    }
                }
            })
        }
        //Make Array from Clicked Card Position
        let tempPileArray = selectedPile.slice(pos);
        //Pushing the new spliced pile into a new Pile
        let tempPiles = [...piles];
        for (let i = 0; i < tempPiles.length; i++) {
            let currentPile = tempPiles[i];
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
        setPiles(tempPiles);
    }

    
    return (
        <div className='sol-pile' data-pil-arr-num={i} onDoubleClick={moveCardsBetweenPiles} key={i} >
            <div className="blank-space" onClick={onOnePress}></div>
            {
                //map each card in the individual pile array to create a card component and add it into the pile
                individualPiles.map((card, cn) => {
                    return <Card card={card} cn={cn} onDoublePress={moveCardsBetweenPiles} onOnePress={onOnePress} key={card.key}/>
                })
            }
        </div>
    )
}

export default Piles;