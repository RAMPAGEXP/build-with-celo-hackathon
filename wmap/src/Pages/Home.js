import React, { useState } from 'react'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
// import Map from "../components/Map";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { wmap_comm_address } from '../config_comm'
import WMAP_COMM from '../WMAP_COMMUNITY.json'


window.Buffer = require('buffer/').Buffer;
const Home = () => {
  //Start
  //sets
  const projectId = '2Ez5uozgwI1uHzPE3d5lz5q6Doq';
  const projectSecret = '840aabc179722af08b4610704b793f94';
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
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

    setLocation(position.coords.latitude + "," + position.coords.longitude);
  }




  const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ OwnerName: '', verificationDetails2: [''], verificationDetails3: [''], verificationDetails1: [''], memberName: [''], lat: '', long: '', houseAddress: '' })

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
    const { OwnerName, verificationDetails, houseAddress, memberName } = formInput
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
    var regexp = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
    const OwnerName = formInput.OwnerName;
    const verificationDetails = formInput.verificationDetails1 + ' ' + formInput.verificationDetails2 + ' ' + formInput.verificationDetails3;

    //Pass Direct Value Of Live Loction
    const houseAddress = location;
    let contract = new ethers.Contract(wmap_comm_address, WMAP_COMM.abi, signer)
    var x = verificationDetails;
    if (regexp.test(x)) {
      let aadharnumber = formInput.verificationDetails1 +  formInput.verificationDetails2 + formInput.verificationDetails3;
      let transaction = await contract.registerHouse(OwnerName, aadharnumber, houseAddress)
      await transaction.wait()
      alert("house registered")
    }
    else {
      window.alert("Invalid Aadhar no.");
    }
  }


    return (
      <>

        <div className="space-y-20">
          <div className="space-y-10">
          <h1>Register your house</h1>
          </div>

          <div className="space-y-10">
            <span htmlFor="name" className="nameInput">Owner Name</span>
            <input id="name" type="text" className="form-control"
              placeholder="House's Owner Name"
              onChange={e => updateFormInput({ ...formInput, OwnerName: e.target.value })} />
          </div>
          <br />

          <div className="space-y-10">
            <span className="nameInput">Verification Details: </span>

            <input type="text" id="pin1" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails1: e.target.value })} />
    
            <input type="text" id="pin2" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails2: e.target.value })}/>
    
            <input type="text" id="pin3" name="pin" maxlength="4" size="4" onChange={e => updateFormInput({ ...formInput, verificationDetails3: e.target.value })}/>

            {/* <input type="text" className="form-control"
              onChange={e => updateFormInput({ ...formInput, verificationDetails: e.target.value })}
              placeholder="e. g. Enter Your Adharcard Number"></input> */}

          </div>
          <br />


          <div className="space-y-10">
            <span htmlFor="name" className="nameInput">Address: </span>
            <span>{location}</span>
          </div>

          <button onClick={getLocation}>Fetch location</button>
          <div className="space-y-10">
            <br />
            <div className="d-flex flex-column flex-md-row">
              <button onClick={registerHouse}>Register house</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  export default Home