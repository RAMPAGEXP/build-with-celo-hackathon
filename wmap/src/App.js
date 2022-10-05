import React, { Component } from "react";
// import LocationDetails from "./components/LocationDetails";
// import LocationMap from "./components/LocationMap";
// import StreetView from "./components/StreetView";
import "./bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css";
import "./App.css";
// import Map from "./components/Map";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
