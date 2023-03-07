import React, {useContext} from 'react';
import "./endgame.css";
import { handleReset } from '../../utils/helpers/Global';
import { GameContext } from '../../context';


export default function EndGame() {
    const {setPiles} = useContext(GameContext);
    const {setAcePile} = useContext(GameContext);
    const {setShuffledDeck} = useContext(GameContext);
    const {setResetGame} = useContext(GameContext);
    const {setEndGame} = useContext(GameContext);

    return (
        <div className='menu--blocker'>
            <div className='menu-window'>
                <h1 className='menu-window-header'>Congratulations!</h1>
                <h2 className='menu-window-header'>You won!</h2>
                <button className='btn-1' onClick={() => {handleReset(setPiles, setAcePile, setShuffledDeck, setResetGame, setEndGame)}}>Play Again</button>
            </div>
        </div>

    )
}
