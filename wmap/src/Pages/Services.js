import React, { Component } from 'react'
import LocationDetails from '../components/LocationDetails'
// import LocationMap from '../components/LocationMap'
// import StreetView from '../components/StreetView'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
import Map from "../components/Map";


class Services extends Component {
  state = {
    location: null,
    error: null
  }

  handleGetLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    const success = pos => {
      const coords = pos.coords

      this.setState({
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: `More or less ${coords.accuracy} meters.`
        },
        
        error: null
      })
    }

    const error = err => {
      const errorMessage = `ERROR(${err.code}): ${err.message}`

      this.setState({
        location: null,
        center:null,
        error: errorMessage
      })
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  }


  
  render() {
    const { location, error } = this.state
    return (
      <div className="App">
        <div className="container-fluid">
          <h1>Geolocation</h1>
          <button className="btn btn-primary mt-3" onClick={this.handleGetLocation.bind(this)}>
            Get Location
          </button>
          <div className="mt-3 max-width-600 mx-auto">
          {!!location && !error ? (
            
            <div>
              <LocationDetails location={location} />
              <div className="mt-3">
              <Map zoom={16} center={{ lat:location.latitude, lng: location.longitude }} />
              </div>
              {/* <div className="mt-3">
                <LocationMap location={location} />
              </div>
              <div className="mt-3">
                <StreetView location={location} />
              </div> */}
            </div>
          ) : <div>{error}</div>
          }
          </div>
        </div>
      </div>
    )
  }
}

export default Services

