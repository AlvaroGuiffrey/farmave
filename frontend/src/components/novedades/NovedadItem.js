import React from 'react';

const NovedadItem = (props) => {
    const { titleNov, subtitle, imagen, body} = props;

    return (
        <div class="container p-5 my-5 border">
            <div class="row">
                <div class="col-sm-2 p-2"></div>
                <div class="col-sm-8">
                    <div class="p-2 text-center bg-primary text-white">
                        <h3>{titleNov}</h3>
                    </div>
                    <div class="p-2 text-center"><h4>{subtitle}</h4></div>
                    <img src={imagen} class="img-thumbnail"/>
                    <div class="p-2 text-start" dangerouslySetInnerHTML={{ __html: body }}></div>
                </div>
            </div>
        </div>
    );
}

export default NovedadItem;