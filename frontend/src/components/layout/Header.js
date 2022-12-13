import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { FaInfoCircle } from 'react-icons/fa';
import '../../styles/components/layout/Header.css';
const Header = (props) => {
    return (
        <header>
            <div className="logo">
                <img src="images/logofarmave.png"  width="100"
                     alt="Farmacia Villa Elisa" />
                <h1>Farmacia Villa Elisa</h1>
                <span className="infopage" id="infopg"  >
                    <FaInfoCircle/>
                </span>
                <Tooltip anchorId="infopg" className="example-orange" classNameArrow="example-arrow" 
                        html="<h4>Experto Universitario en</h4>
                                <h4>Programación Full Stack</h4>  
                                <p>Docente: Flavia Ursino</p>
                                <p>Alumno: Alvaro Guiffrey</p>" 
                        place="right"/>
                </div>
                
            
        </header>
    );
}

export default Header;

