import React, { useContext } from 'react'
import Piles from '../../Components/Piles/PIles';
import AcePiles from '../../Components/AcePIles/AcePiles';
import ShuffledDeck from '../../Components/Shuffled Deck/ShuffledDeck'
import { GameContext } from '../../context';
import { cardSelect } from '../../utils/helpers/Movement';


function PlayingField({ selectCard }) {
    const { piles } = useContext(GameContext);
    const { acePile } = useContext(GameContext);
    const { firstCardSelected, setFirstCardSelected } = useContext(GameContext);

    //Moving card back to the game from the ace pile
    function moveBackToGame(e) {
        const s = cardSelect(e.target, piles);
        if (s === undefined) {
            return;
        }

        let selectedAcePile = acePile[s.selectedAcePile];
        let selectedCard = selectedAcePile[selectedAcePile.length - 1];

        selectedCard.selected = !selectedCard.selected;
        setFirstCardSelected([selectedCard]);
        return;
    }




    return (
        <div className='game-layout'>
            <div className="ace-pile-spot">
                <div className="ace-pile-layout">
                    {
                        acePile.map((pile, i) => {
                            return <AcePiles pile={pile}
                                onOnePress={firstCardSelected === null ? moveBackToGame : selectCard}
                                i={i}
                                key={i} />
                        })
                    }
                </div>
            </div>
            
            <div className='card-layout'>
                <ShuffledDeck selectCard={selectCard} />
                {
                    piles.map((pile, i) => {
                        return <Piles
                            individualPiles={pile}
                            key={i}
                            i={i}
                            onOnePress={selectCard}
                        />
                    })
                }
            </div>
        </div>
    )
}

export default PlayingField;