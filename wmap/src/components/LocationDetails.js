import React from 'react'

const LocationDetails = ({ location }) => (
  <div>
    <div>
      <strong>Latitude:</strong> {location.latitude}
    </div>
    <div>
      <strong>Longitude:</strong> {location.longitude}
    </div>
    <div>
      <strong>Accuracy:</strong> {location.accuracy}
    </div>
  </div>
)

export default LocationDetails
