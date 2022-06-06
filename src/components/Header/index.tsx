import React from 'react';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import './style.css';

const Header = ()=>{

    return(
        <header className="header">
            <Logo />
            <button>Kriptomat account</button>
        </header>
    )
}

export default Header;