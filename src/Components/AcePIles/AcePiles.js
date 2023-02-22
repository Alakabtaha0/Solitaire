import React from "react";
import Card from "../Card/Card";

const AcePiles = ({ pile, onOnePress, i }) => {

    return (
        <div className="ace" data-ace-pil-arr-num={i} onClick={onOnePress} key={i}>
            <div className="blank-space"  ></div>
            {
                pile.map((card) => {
                    return <Card card={card} key={card.key}/>
                })
            }
        </div>
    )
}

export default AcePiles;