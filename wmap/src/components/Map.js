import React, { Component } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const LIBRARIES = ["places"];

class Map extends Component {
  render() {
    const { center, zoom } = this.props;

    return (
      <div className="wrapper">
        <LoadScript googleMapsApiKey="" libraries={LIBRARIES}>
          <GoogleMap
            id="map"
            center={center}
            zoom={zoom}
            mapContainerStyle={{ height: "100vh" }}
          >
            {/*  Marker component */}
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

export default Map;
