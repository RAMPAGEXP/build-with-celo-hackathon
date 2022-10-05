import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'

const Navbar = () => {
    const navigate = useNavigate();

    const Home = () => {
        navigate("/");
    };

    const services = () => {
        navigate("/services");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
                <a className="navbar-brand" onClick={Home}>WMAP</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" onClick={Home} >Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={services}>services</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar