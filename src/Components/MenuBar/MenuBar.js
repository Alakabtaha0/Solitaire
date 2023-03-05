import React, { useContext } from 'react'
import "./MenuBar.css";
import ResetButton from '/Users/vipnumbers/Desktop/Projects/solitaire/src/images/Reset Button.png';
import { GameContext } from '../../context';

function MenuBar() {
    const {setResetGame} = useContext(GameContext);
    const {setPiles} = useContext(GameContext);
    const {setAcePile} = useContext(GameContext);
    const {setShuffledDeck} = useContext(GameContext);


    const handleReset = () => {
        setPiles([[], [], [], [], [], []]);
        setAcePile([[], [], [], []]);
        setShuffledDeck([]);
        setResetGame(resetGame => !resetGame);
    }
    return (
        <div className='menu-bar'>
            <div className='reset-button' onClick={handleReset}>
                <img src={ResetButton} alt='Solitaire reset button' ></img>
            </div>
        </div>
    )
}

export default MenuBar;
