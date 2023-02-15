import React from "react";
import Card from "../Card/Card";

const AcePiles = ({ pile, cn }) => {

    return (
        <div className="ace">
            {
                pile.map((card) => {
                    return <Card card={card} cn={cn} />
                })
            }
        </div>
    )
}

export default AcePiles;