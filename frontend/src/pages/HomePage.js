import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import '../styles/pages/HomePage.css';

const HomePage = (props) => {
    return (
        <main className="contenedor">
          <section>
            <aside>
              <div className="info">
              <p><FaInfoCircle /> Atendemos todas las Obras Sociales</p>
              </div>
              <div className="info">
                <p><FaInfoCircle /> Envios a domicilio</p>
              </div>
              <div className="info">
                <p><FaInfoCircle /> Recibimos todos los medios de pago</p>
              </div>
            </aside>
            <div className="homeimage">
              <img src="images/home/farmacia10.jpg" alt="Farmacia Villa Elisa" />
            </div>
          </section>
          <section>
            <div className="columnas">
              <div className="bienvenidos left">
                <h2>Bienvenidos</h2>
                <p>Nos llena de orgullo que elija nuestra farmacia para realizar sus compras.
                Nos comprometemos a brindarle la mejor atención.</p>
              </div>
              <div className="testimonios right">
                <h2>Testimonios</h2>
                <div className="testimonio">
                  <span className="cita">Simplemente excelente!!</span>
                  <span className="autor">Juan Perez</span>
                </div>
              </div>
            </div>
          </section>
        </main>
    );
}

export default HomePage;
