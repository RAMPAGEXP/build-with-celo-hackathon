import React, { useState } from 'react'
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

const Home = () => {
  //Start
  //sets
  // const projectId = fs.readFileSync(".infuraid").toString().trim() || '';
  // const projectSecret = fs.readFileSync(".infurasecret").toString().trim() || '';
  // const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
  const [location, setLocation] = useState();
    // let location;
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
      }
    }
  
    function showPosition(position) {
      setLocation(position.coords.latitude + "," + position.coords.longitude)
    }

  const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    // headers: {
    //   authorization: auth,
    // },
  });

  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ OwnerName: '', verificationDetails: [''], memberName: [''], houseAddress: '' })

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
    const { OwnerName, verificationDetails, houseAddress, memberName, } = formInput
    if (!OwnerName || !verificationDetails || !houseAddress || !memberName) return
    /* first, upload to IPFS #####auctionprice*/
    const data = JSON.stringify({
      OwnerName, verificationDetails, houseAddress, memberName,
    })
    try {
      const added = await client.add(data)
      const url = `https://wmap.infura-ipfs.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function registerHouse() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const OwnerName = formInput.OwnerName;
    const verificationDetails = formInput.verificationDetails;
    const houseAddress = formInput.houseAddress;
    // const auctionprice = ethers.utils.parseUnits(formInput.auctionprice, 'ether')

    let contract = new ethers.Contract(wmap, WMAP.abi, signer)
    // let mintingPrice = await contract.getMintingPrice()
    // mintingPrice = mintingPrice.toString()

    let transaction = await contract.registerHouse(OwnerName, verificationDetails, houseAddress)
    await transaction.wait()
    alert("house registered")
  }
  return (
    <>

      <div class="space-y-20">
        <div class="space-y-10">
          <span for="name" class="nameInput">QR Code</span>

        </div>

        <div class="space-y-10">
          <span for="name" class="nameInput">Owner Name</span>
          <input id="name" type="text" class="form-control"
            placeholder="House's Owner Name"
            onChange={e => updateFormInput({ ...formInput, OwnerName: e.target.value })} />
        </div>

        <div class="space-y-10">
          <span class="nameInput">Verification Details </span>

          <input type="number" class="form-control"
            onChange={e => updateFormInput({ ...formInput, verificationDetails: e.target.value })}
            placeholder="e. g. Enter Your Adharcard Number"></input>

        </div>

        <div class="space-y-10">
          <span for="name" class="nameInput">Address</span>
          <input id="name" type="text" class="form-control"
            placeholder="House's Owner Name" value={location}
            onChange={e => updateFormInput({ ...formInput, houseAddress: e.target.value })} />
        </div>
        <button onClick={getLocation}>get location</button>
        <div class="space-y-10">
          <div class="d-flex flex-column flex-md-row">
            <button onClick={registerHouse}>Register house</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home