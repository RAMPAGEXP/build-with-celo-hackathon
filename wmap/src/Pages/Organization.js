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


const Organization = () => {
    const [formInput, updateFormInput] = useState({ vehicleNumber: '', garbageValue: '', tokenId: '' })
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [walletAddress, setWalletAddress] = useState("");
    const [location, setLocation] = useState();
    const client = ipfsHttpClient('https://wmap.infura.io:5001/api/v0')
    useEffect(() => {
        loadNFTs()
    }, [])

    async function requestAccount() {
        // console.log('Requesting account...');

        // ❌ Check if Meta Mask Extension exists 
        if (window.ethereum) {
            // console.log('detected');

            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
            } catch (error) {
                console.log('Error connecting...');
            }

        } else {
            alert('Meta Mask not detected');
        }
    }

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


    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount();
        }

        const marketplaceContract = new ethers.Contract(wmap_comm_address, WMAP_COMM.abi, signer)
        const data = await marketplaceContract.fetchHouse()

        const items = await Promise.all(data.map(async i => {
            let item = {

                // OwnerName,
                tokenId: i.tokenId.toString(),
                // seller: i.seller,

                owner: i.OwnerWalletAddress,

                OwnerName: i.OwnerName,

                OwnerVerificationDetails: i.OwnerVerificationDetails,

                houseAddress: i.houseAddress,

                verificationDetalis: i.verificationDetails,

                nameOfMembers: i.memberName,

                garbageWeightLimit: i.garbageWeightLimit
                // tokenURI
            }
            return item

        }))
        setNfts(items)
        console.log(items)
        setLoadingState('loaded')
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

    // Vehicle Registration
    async function vehicleRegister() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const vehicleNumber = formInput.vehicleNumber;
        let contract = new ethers.Contract(wmap_org_address, WMAP_ORG.abi, signer)
        let transaction = await contract.registerVehicle(vehicleNumber)
        await transaction.wait()
        alert("Vehicle Registered")
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

    // fetch garbage record
    async function getGarbageDetails() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let tokenid = formInput.tokenId;
        let contract = new ethers.Contract(wmap_org_address, WMAP_ORG.abi, signer)
        let transaction = await contract.getGarbageCollectionDetails(tokenid);
        // await transaction.wait()
        console.log(transaction)
        document.getElementById('garbageRecord').innerHTML += transaction;
        // alert("Garbage Collected")
    }

    // fetch penalty houses
    async function fetchPenaltyHouse() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let tokenid = document.getElementById("tokenId").value;
        let contract = new ethers.Contract(wmap_org_address, WMAP_ORG.abi, signer)
        let transaction = await contract.fetchPenaltyHouses()
        // await transaction.wait()
        console.log(transaction)
        document.getElementById("fetchPenaltyHouses").innerHTML += transaction
    }

    // fetch registered vehicle
    async function fetchVehicle() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(wmap_org_address, WMAP_ORG.abi, signer)
        let transaction = await contract.getVehicleDetails();
        console.log(transaction)
        document.getElementById("vehicle").innerHTML = transaction;
    }
    return (
        <>
            {nfts.map((nft, i) => (
                <div>

                    <div>
                        <h3>Register Vehicle</h3>
                        <div className="space-y-10">
                            <span htmlFor="name" className="nameInput">Vehicle number</span>
                            <input id="name" type="text" className="form-control"
                                placeholder="Vehicle Number"
                                onChange={e => updateFormInput({ ...formInput, vehicleNumber: e.target.value })} />

                            <input id="tokenId" type="hidden" className="form-control"
                                value={nft.tokenId}
                            />
                            <input id="garbageLimit" type="hidden" className="form-control"
                                value={nft.garbageWeightLimit}
                            />
                            <input id="tokenowner" type="hidden" className="form-control"
                                value={nft.owner}
                            />
                        </div>
                        <button onClick={vehicleRegister} >register</button>
                    </div>
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
                    <br />
                    <br />
                    <div>
                        <h3>fetch Garbage Record</h3>
                        <div className="space-y-10">
                            <span htmlFor="name" className="nameInput">enter tokenId</span>
                            <input id="name" type="text" className="form-control"
                                placeholder="tokenId"
                                onChange={e => updateFormInput({ ...formInput, tokenId: e.target.value })} />
                        </div>
                        <button onClick={getGarbageDetails}>fetch</button>
                        <span id='garbageRecord'></span>

                    </div>
                    <br />
                    <br />
                    <div>
                        <h3>fetch Penalty Houses</h3>
                        <button onClick={fetchPenaltyHouse}>fetch</button>
                        <span id='fetchPenaltyHouses'></span>
                    </div>
                    <br />
                    <br />
                    <div>
                        <h3>your vehicles</h3>
                        <button onClick={fetchVehicle}>tap to see</button>
                        <span id='vehicle'></span>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Organization