import React from "react";
import './Card.css';
import PlayingCard from '/Users/vipnumbers/Desktop/Projects/solitaire/src/images/Back of playing card.jpeg';

export default function Card({ card, cn, onDoublePress, onOnePress }) {
    
    if (!card) {
        console.log('error')
        return null;
    } else {
        //Ensuring consistency in clicks
        const checkClick = (onClick, onDoubleClick) => {
            let clicks = 0;
            let timeout;

            return (event) => {
                clicks++;
                if (clicks === 1) {
                    timeout = setTimeout(() => {
                        try {
                            onClick(event);
                            clicks = 0;
                        } catch (err) {
                            onClick(event);
                        }

                    }, 200);
                } else {
                    clearTimeout(timeout);
                    onDoubleClick(event);
                    clicks = 0;
                }
            };
        };
        const onClicking = checkClick(onOnePress, onDoublePress);
        try {
            if (card.hidden !== true) {

                return (
                    <div key={card.key} className={`card shown ${card.selected ? 'red-border' : ''}`} onClick={onClicking} style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} data-card-num={card.key} >
                        <h1 className={card.color === 'red' ? 'red' : ''}>{card.value}</h1>
                        <h2 className={card.color === 'red' ? 'red' : ''}>{card.suit}</h2>
                    </div>
                )
            } else {
                return (
                    <div key={card.key} className="card" onClick={onDoublePress} style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} >
                        <img className='back-card' src={PlayingCard} alt='playing card'></img>
                    </div>

                )
            }
        } catch (err) {

            return (
                <div key={card.key} className='card' onClick={onClicking} style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} data-card-num={card.key} >
                    <h1 className={card.color === 'red' ? 'red' : ''}>{card.value}</h1>
                    <h2 className={card.color === 'red' ? 'red' : ''}>{card.suit}</h2>
                </div>
            )
        }
    }

}

