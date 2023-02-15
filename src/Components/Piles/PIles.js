import React from "react"
import Card from "../Card/Card"

//Temp -- will get put into its own component
const Piles = ({ piles, i, pileClick, cardClick }) => {
    return (
        <div className='sol-pile' data-pil-arr-num={i} onClick={pileClick} >
            <div className="blank-space"></div>
            {
                //map each card in the individual pile array to create a card component and add it into the pile
                piles.map((card, cn) => {
                    return <Card card={card} cn={cn} onPress={cardClick} />
                })
            }
        </div>
    )
}

export default Piles;