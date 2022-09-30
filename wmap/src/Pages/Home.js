import React, { Component } from 'react'
// import LocationDetails from '../components/LocationDetails'
// import LocationMap from '../components/LocationMap'
// import StreetView from '../components/StreetView'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
// import Map from "../components/Map";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { wmap } from '../config'
import WMAP from '../WMAPAbi.json'
import { Buffer } from 'buffer';


window.Buffer = Buffer;



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

//Start
     //sets
     const projectId = fs.readFileSync(".infuraid").toString().trim() ||''; 
     const projectSecret = fs.readFileSync(".infurasecret").toString().trim() || '';
     const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
 
     const client = ipfsHttpClient({
       host: 'ipfs.infura.io',
       port: 5001,
       protocol: 'https',
       headers: {
         authorization: auth,
       },
     });
 
    const [Types, setTypes] = useState();
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ OwnerName: '', verificationDetails: [''], memberName: [''],houseAddress:''})

    async function onChange(e) {
      const file = e.target.files[0]
      try {
        const added = await client.add(
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        const url = `https://wmap.infura-ipfs.io/ipfs/${added.path}`
        setFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }

    async function uploadToIPFS() {
      const { OwnerName, verificationDetails, houseAddress,memberName, } = formInput
      if (!OwnerName || !verificationDetails || !houseAddress || !memberName) return
      /* first, upload to IPFS #####auctionprice*/
      const data = JSON.stringify({
        OwnerName, verificationDetails,houseAddress,memberName,
      })
      try {
        const added = await client.add(data)
        const url = `https://wmap.infura-ipfs.io/ipfs/${added.path}`
        /* after file is uploaded to IPFS, return the URL to use it in the transaction */
        return url
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    navigate('/')
    }


   
    return (
     <>
     
     </>
    )
  }
}

export default Home
