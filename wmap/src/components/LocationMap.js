import React from 'react'

const LocationMap = ({ location }) => (
  <div className="embed-responsive embed-responsive-16by9">
    <iframe
      className="embed-responsive-item"
      title="LocationMap"
      // width="600"
      // height="450"
      frameBorder="0"
      style={{ border: '0' }}
      src={
        'https://www.google.com/maps/embed/v1/place?key=' +
        process.env.REACT_APP_GOOGLE_API_KEY +
        '&q=AIzaSyBD7JOLQ1wlkarljBPfEJD4NVngzfUhCQY' +
        location.latitude +
        ',' +
        location.longitude +
        '&zoom=16'
      }
      allowFullScreen
    />
  </div>
)

export default LocationMap
