import React, { useContext } from 'react'
import "./MenuBar.css";
import ResetButton from '../../images/Reset Button.png';
import { GameContext } from '../../context';
import { handleReset } from '../../utils/helpers/Global';
function MenuBar() {
    const {setResetGame} = useContext(GameContext);
    const {setPiles} = useContext(GameContext);
    const {setAcePile} = useContext(GameContext);
    const {setShuffledDeck} = useContext(GameContext);
    const {setEndGame} = useContext(GameContext);

    
    return (
        <div className='menu-bar'>
            <div className='reset-button' onClick={() => {handleReset(setPiles, setAcePile, setShuffledDeck, setResetGame, setEndGame)}}>
                <img src={ResetButton} alt='Solitaire reset button' ></img>
            </div>
        </div>
    )
}

export default MenuBar;
