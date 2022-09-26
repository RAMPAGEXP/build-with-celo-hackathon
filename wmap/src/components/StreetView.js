import React from 'react'

const StreetView = ({ location }) => (
  <div className="embed-responsive embed-responsive-16by9">
    <iframe
      className="embed-responsive-item"
      title="StreetView"
      // width="600"
      // height="450"
      frameBorder="0"
      style={{ border: '0' }}
      src={
        'https://www.google.com/maps/embed/v1/streetview?key=' +
        process.env.REACT_APP_GOOGLE_API_KEY +
        '&location=' +
        location.latitude +
        ',' +
        location.longitude +
        '&heading=180&pitch=0&fov=90'
      }
      allowFullScreen
    />
  </div>
)

export default StreetView
