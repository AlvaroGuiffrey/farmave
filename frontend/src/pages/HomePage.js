import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import swal from 'sweetalert';

import '../styles/pages/HomePage.css';

const HomePage = (props) => {

  swal({
    title: "¡BIENVENIDO!",
    text: "No olvide visitar nuestra página de PROMOCIONES.",
    icon: "info",
    
  });

    return (
        <main className="contenedor">
          <div class="container">
            <div class="row">
              <div class="col-sm-3">
                <div className="info">
                <p><FaInfoCircle /> Atendemos todas las Obras Sociales</p>
                </div>
                <div className="info">
                  <p><FaInfoCircle /> Envios a domicilio</p>
                </div>
                <div className="info">
                  <p><FaInfoCircle /> Recibimos todos los medios de pago</p>
                </div>
              </div>
              <div class="col-sm-6">
                <div>
                <img src="images/home/farmacia10.jpg" alt="Farmacia Villa Elisa" class="img-thumbnail"/>
                </div>
                <div>
                  <div class="p-2 mt-3 text-center bg-primary text-white">
                      <h3>Bienvenidos</h3>
                  </div>  
                  <div class="p-3 text-start">
                    <p>Nos llena de orgullo que elija nuestra farmacia para realizar sus compras.
                    Nos comprometemos a brindarle la mejor atención y servicio.</p>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div className="testimonios right">
                  <h2>Testimonios</h2>
                  <div className="testimonio">
                    <span className="cita">Excelente atención!!</span>
                    <span className="autor">Juan Perez</span>
                    <hr/>
                    <span className="cita">Buen servicio.</span>
                    <span className="autor">María Gomez</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    );
}

export default HomePage;
