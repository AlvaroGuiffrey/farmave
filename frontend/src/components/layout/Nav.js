import { NavLink } from 'react-router-dom';

import '../../styles/components/layout/Nav.css';

const Nav = (props) => {
    return (
        <nav>
            <div>
                <ul>
                <li><NavLink to="/" className={({ isActive }) => isActive ? "activo": undefined}>Home</NavLink></li>
                    <li><NavLink activeClassName="activo" exact to="/nosotros" className={({ isActive }) => isActive ? "activo": undefined}>Nosotros</NavLink></li>
                    <li><NavLink activeClassName="activo" exact to="/novedades" className={({ isActive }) => isActive ? "activo": undefined}>Novedades</NavLink></li>
                    <li><NavLink activeClassName="activo" exact to="/promociones" className={({ isActive }) => isActive ? "activo": undefined}>Promociones</NavLink></li>
                    <li><NavLink activeClassName="activo" exact to="/contacto" className={({ isActive }) => isActive ? "activo": undefined}>Contacto</NavLink></li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
