import React, { useState, useEffect } from 'react'
import '../bootstrap-4.0.0-beta.2-dist/css/bootstrap.min.css'
import '../App.css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { wmap_comm_address } from '../config_comm'
import { wmap_org_address } from '../config_org'
import WMAP_COMM from '../WMAP_COMMUNITY.json'
import WMAP_ORG from '../WMAP_ORGANIZATION.json'
import { useNavigate } from 'react-router-dom'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { wmap_token_address } from '../config_token'

const Add = () => {
    const [formInput, updateFormInput] = useState({ vehicleNumber: '', garbageValue: '', tokenId: '' })
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [walletAddress, setWalletAddress] = useState("");
    const [location, setLocation] = useState();
    const client = ipfsHttpClient('https://wmap.infura.io:5001/api/v0')

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

    async function uploadToIPFS() {
        const { OwnerName, verificationDetails, houseAddress, memberName } = formInput
        if (!OwnerName || !verificationDetails || !houseAddress || !memberName) return
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

    //Collect Garbage
    async function garbageCollection() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let tokenid = document.getElementById("token").value;
        let garbageWeightLimit = document.getElementById("garbageLimit").value;
        let owner = document.getElementById("tokenowner").value;
        const garbageValue = formInput.garbageValue;
        // const location = document.getElementById('location').value;
        let contract = new ethers.Contract(wmap_org_address, WMAP_ORG.abi, signer)
        let transaction = await contract.garbageRecord(tokenid, garbageValue, location, garbageWeightLimit, owner, wmap_token_address);
        await transaction.wait()
        alert("Garbage Collected")
    }
    return (
        <>
            <div>
                <h3>Enter Garbage Record</h3>
                <div className="space-y-10">
                    <span htmlFor="name" className="nameInput">garbage weight</span>
                    <input id="weight" type="text" className="form-control"
                        placeholder="enter in kg"
                        onChange={e => updateFormInput({ ...formInput, garbageValue: e.target.value })} />
                    <input id="token" type="text" className="form-control"
                        placeholder='enter tokenid'
                    />
                    <span id='location'>{location}</span>
                </div>
                <button onClick={getLocation}>Fetch location</button>
                <br />
                <button onClick={garbageCollection}>submit</button>
            </div>
        </>
    )
}

export default Add