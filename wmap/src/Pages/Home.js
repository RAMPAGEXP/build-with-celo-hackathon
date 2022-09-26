import React, { Component } from 'react'
// import LocationDetails from '../components/LocationDetails'
// import LocationMap from '../components/LocationMap'
// import StreetView from '../components/StreetView'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
// import Map from "../components/Map";


class Home extends Component {
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
     <>
     
     </>
    )
  }
}

export default Home
