import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCheck } from 'react-icons/fa';
import swal from 'sweetalert';

import PromocionItem from '../components/promociones/PromocionItem';

import '../styles/pages/PromocionesPage.css';

const PromocionesPage = (props) => {

  const [loading, setLoading] = useState(false);
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    const cargarPromociones = async () => {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/promociones');
        setPromociones(response.data);
        setLoading(false);
    };

    cargarPromociones();
  }, []);

  swal({
    title: "PROMOCIONES",
    text: "Puede reservar promociones ingresando como cliente.",
    icon: "info",
    
  });

    return (
      <main className="contenedor">
        <div class="col-2">
          <a href="http://localhost:3000" class="btn btn-outline-primary "><FaUserCheck/> Ingreso Cliente</a>
        </div>
        <h2>Promociones</h2>
        <div class="container border">
                <div class="row">
                {loading ? (
                <p>Cargando ...</p>
                ) : (
                promociones.map(item => <PromocionItem key={item.id}
                name={item.nombre} detail={item.detalle} imagen={item.imagen} 
                price={item.precio} quantity={item.cantidad}
                />)
                
                )}
            </div>
        </div>
      </main>
    );
}

export default PromocionesPage;
