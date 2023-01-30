import React from 'react';

const PromocionItem = (props) => {
    const { name, detail, imagen, price, quantity} = props;

    return (
                       
                <div class="col-sm-4 border ">
                    <div class="p-2 text-center bg-primary text-white">
                        <h4>{name}</h4>
                    </div>
                    <img src={imagen} class="img-thumbnail"/>
                    <div class="p-2 text-center"><p>{detail}</p></div>
                    <div class="p-2 text-center"><h4><mark> Precio $ {price} </mark></h4></div>
                    <div class="p-2 text-center"><p>Cantidad disponible: {quantity}</p></div>
                </div>
        
    );
}

export default PromocionItem;