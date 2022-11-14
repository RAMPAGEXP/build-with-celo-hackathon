import React, { Component } from 'react'
import Map from '../components/Map';

import '../App.css'



class QrDetails extends Component {

  
  render() {
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get("id");
    const houseaddress = queryParams.get("houseaddress");
    const ownername = queryParams.get("ownername");
    const VerificationDetails = queryParams.get("VerificationDetails");
    const latitude = Math.floor(houseaddress.split(',')[0]);
    const longitude = Math.floor(houseaddress.split(',')[1]);

    return (
      <div className="App">
        <div className="container-fluid">
          <h1>#{id}:{ownername}</h1>
          <h1>Addhar Number: {VerificationDetails}</h1>
          <h1></h1>
          <button className="btn btn-primary mt-3">
            Get Location
          </button>
          <div className="mt-3 max-width-600 mx-auto">
          <Map zoom={15} center={{lat:latitude,lng:longitude}}/>
          </div>
        </div>
      </div>
    )
  }
}

export default  QrDetails

