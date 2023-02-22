import React from "react"
import Card from "../Card/Card"

//Temp -- will get put into its own component
const Piles = ({ piles, i, pileClick, cardClick, onOnePress }) => {
    return (
        <div className='sol-pile' data-pil-arr-num={i} onDoubleClick={pileClick} key={i} >
            <div className="blank-space" onClick={onOnePress}></div>
            {
                //map each card in the individual pile array to create a card component and add it into the pile
                piles.map((card, cn) => {
                    return <Card card={card} cn={cn} onDoublePress={cardClick} onOnePress={onOnePress} key={card.key}/>
                })
            }
        </div>
    )
}

export default Piles;