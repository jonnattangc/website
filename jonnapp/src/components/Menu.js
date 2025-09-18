import React from 'react';
import { NavLink, } from 'react-router-dom';

class Menu extends React.Component {
    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                        <div className="App_Menu" class="navbar-brand"> Principal </div>
                    </NavLink>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <NavLink to="/check" >
                                    <div class="nav-item nav-link">Estados</div>
                                </NavLink>
                            </li>
                            <li class="nav-item">
                                <NavLink to="/experiments">
                                    <div class="nav-item nav-link" >Experimentos</div>
                                </NavLink>
                            </li>
                            <li class="nav-item">
                                <NavLink to="/game" class="nav-item nav-link">
                                    <div class="nav-item nav-link" >Juego</div>
                                </NavLink>
                            </li>
                            <li class="nav-item">
                                <NavLink to="/chat" class="nav-item nav-link">
                                    <div class="nav-item nav-link" > Chat </div>
                                </NavLink>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" aria-current="page" href='https://www.jonnattan.com' target='_blank' rel='noreferrer' >
                                    Personal
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-item nav-link" aria-current="page" href='https://github.com/jonnattangc' target='_blank' rel='noreferrer' >
                                    Gibhub
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-item nav-link" aria-current="page" href='https://sonarcloud.io/organizations/jonnattan-org/projects' target='_blank' rel='noreferrer' >
                                    Sonar
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-item nav-link" aria-current="page" href='https://www.buenaventuracadiz.cl' target='_blank' rel='noreferrer' >
                                    Fundación
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export { Menu };
