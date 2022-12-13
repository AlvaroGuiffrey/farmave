import React from 'react';

import '../styles/pages/NosotrosPage.css';

const NosotrosPage = (props) => {
    return (
      <main className="contenedor">
        <section>
          <div className="historia">
            <h2>Historia</h2>
            <p>Nuestra farmacia fue adquirida en 1957 por el Dr. Carlos María Guiffrey (Farmaceútico y Bioquímico).</p>
            <p>Desde aquel año, hasta el 2010 la Dirección Técnica y Comercial estuvo a su cargo.</p>
            <p>A partir del 2010 la prestación del servicio la brinda Farmacia Villa Elisa SRL, bajo la responsabilidad de la misma familia.</p>
            <p></p>
          </div>
          </section>
          <hr />
          <section>
          <div className="personas">
            <h2>Staff</h2>
            <div className="persona">
              <img src="images/nosotros/farmaceutica01.png" width="75" alt="Silvia" />
              <h5>Silvia Ines Barrera</h5>
              <h6>Directora Técnica</h6>
              <p>Farmacéutica Nacional.</p>
              <p>Se hizo cargo de la Dirección Técnica de la farmacia en el año 2010.</p>
            </div>
            <div className="persona">
              <img src="images/nosotros/gerenta01.png" width="75" alt="Maria" />
              <h5>María Delfa Bochaton</h5>
              <h6>Gerenta</h6>
              <p></p>
              <p>Socia Gerenta de Farmacia Villa Elisa SRL.</p>
            </div>
            <div className="persona">
              <img src="images/nosotros/socio01.png" width="75" alt="Alvaro" />
              <h5>Alvaro A Guiffrey</h5>
              <h6>Socio</h6>
              <p></p>
              <p>Socio de Farmacia Villa Elisa SRL.</p>
            </div>
          </div>
        </section>
      </main>
    );
}

export default NosotrosPage;
