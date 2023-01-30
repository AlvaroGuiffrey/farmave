import React, { useState } from 'react';
import axios from 'axios';
import { FaInfoCircle, FaPhone, FaMailBulk, FaMobile, FaWhatsapp, 
  FaInstagram, FaFacebook, FaRegPaperPlane, FaRegEnvelope } from 'react-icons/fa';

import '../styles/pages/ContactoPage.css';

const ContactoPage = (props) => {

  const initialForm = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  }

  const [sending, setSending] =useState(false);
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState(initialForm);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(oldData => ({
      ...oldData,
      [name]: value
    }));
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setSending(true);
    const response = await axios.post('http://localhost:3000/api/contacto', formData);
    setSending(false);
    setMsg(response.data.message);
    if (response.data.error === false) {
      setFormData(initialForm)
    }
  }  
  return (
      <main className="contenedor">
        <div className="columna contacto">
          <h2>Complete el siguiente formulario</h2>
            <form className="formulario" action="/contacto" method="post" onSubmit={handleSubmit}>
            <p>
              <label>Nombre</label>
              <input type="text" name="nombre" value={formData.nombre}
              onChange={handleChange}/>
            </p>
            <p>
              <label>Email</label>
              <input type="email" name="email" value={formData.email}
              onChange={handleChange}/>
            </p>
            <p>
              <label>Teléfono</label>
              <input type="tel" name="telefono" value={formData.telefono}
              onChange={handleChange}/>
            </p>
            <p>
              <label>Comentario</label>
              <textarea name="mensaje" value={formData.mensaje}
              onChange={handleChange}></textarea>
            </p>
            
            <p className="centrar"><input type="submit"
                value="Enviar"/>
            </p>
            {sending ? <div class="alert alert-info"><FaRegPaperPlane/><strong> Enviando...</strong></div> : null}
            {msg ? <div class="alert alert-success"><FaRegEnvelope/><strong> {msg}!</strong></div> : null}
          </form>
        </div>
        
        <div className="columna datos">
          <h2>Otras vias de contacto</h2>
          <div className="medios">
          <p><FaInfoCircle/> Tambien puede contactarse con nosotros
              por los siguientes medios:</p>
          </div>
          <div>
          <ul>
            <li><FaPhone/> Teléfono: 03447 480002</li>
            <li><FaMobile/> Celular: 03447 15491836</li>
            <li><FaWhatsapp/> WhatsApp: 3447491836</li>
            <li><FaMailBulk/> Email: farmaciavillaelisa@gmail.com</li>
            <li><FaFacebook/> Facebook</li> 
            <li><FaInstagram/> Instagram</li>
          </ul>
          </div>
        </div>
        
      </main>
  );
}

export default ContactoPage;
