import React from "react";
import './Card.css';
import PlayingCard from '/Users/vipnumbers/Desktop/Projects/solitaire/src/images/Back of playing card.jpeg';

export default function Card({ card, cn, onPress }) {

    try {
        if (card.hidden !== true) {
            return (
                <div className='card' onClick={onPress} style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} data-card-num={card.key} >
                    <h1 className={card.color === 'red' ? 'red' : ''}>{card.value}</h1>
                    <h2 className={card.color === 'red' ? 'red' : ''}>{card.suit}</h2>
                </div>
            )
        } else {
            return (
                <div className="card" style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} >
                    <img className='back-card' src={PlayingCard} alt='playing card'></img>
                </div>
                
            )
        }
    } catch (err) {
        return (
            <div className='card' onClick={onPress} style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} data-card-num={card.key} >
                    <h1 className={card.color === 'red' ? 'red' : ''}>{card.value}</h1>
                    <h2 className={card.color === 'red' ? 'red' : ''}>{card.suit}</h2>
                </div>
        )
    }
    /*
    if (card.hidden !== true) {
        return (
            <div className='card' onClick={onPress} style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} data-card-num={card.key} >
                <h1 className={card.color === 'red' ? 'red' : ''}>{card.value}</h1>
                <h2 className={card.color === 'red' ? 'red' : ''}>{card.suit}</h2>
            </div>
        )
    } else {
        return (
            <div className="card" style={{ marginTop: cn && (cn > 0 ? `-80px` : '') }} >
                <img className='back-card' src={PlayingCard} alt='playing card'></img>
            </div>
            
        )
    }*/


}

