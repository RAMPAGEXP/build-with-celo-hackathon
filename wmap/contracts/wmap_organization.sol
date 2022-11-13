// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

// waste menagement assistive protocol
contract WMAP_ORGANIZATION is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    Counters.Counter private vehicleId;
    address payable owner;

    constructor() ERC721("QRNFT", "RXP") {
        owner = payable(msg.sender);
    }

    // mapping(uint256 => House) private idToHouse;
    mapping(uint256 => garbageCollection) private idToGarbage;
    mapping(uint256 => garbageVehicles) private idToVehicle;

    // Vehicle Details
    struct garbageVehicles {
        uint256 vehicleId;
        address vehicle;
        string vehicleNumber;
    }

    // Garbage Data
    struct garbageCollection {
        uint256 tokenId;
        uint256 garbageValue;
        uint256 garbageCollecteddays;
        int256 rewardPoints;
        uint256 rewardmonths;
        uint256 penaltymonths;
        uint256 garbageCollectedTime;
        string location;
    }

    // register vehicles
    function registerVehicle(string memory vehicleNumber) public {
        vehicleId.increment();
        idToVehicle[vehicleId.current()].vehicleNumber = vehicleNumber;
        idToVehicle[vehicleId.current()].vehicle = msg.sender;
    }

    // daily garbage collection data and reward distribution
    function garbageRecord(
        uint256 tokenId,
        uint256 garbageValue,
        string memory location,
        uint256 garbageWeightLimit,
        address NFTOwner,
        address WMAPToken
    ) public {
        uint256 timestemp = block.timestamp;
        idToGarbage[tokenId].tokenId = tokenId;
        idToGarbage[tokenId].garbageValue = garbageValue;
        idToGarbage[tokenId].location = location;
        idToGarbage[tokenId].garbageCollectedTime = timestemp;
        idToGarbage[tokenId].garbageCollecteddays += 1;
        if (garbageValue <= garbageWeightLimit) {
            idToGarbage[tokenId].rewardPoints += 1;
        } else {
            idToGarbage[tokenId].rewardPoints -= 1;
        }
        if (idToGarbage[tokenId].garbageCollecteddays == 29) {
            if (idToGarbage[tokenId].rewardPoints >= 17) {
                // user got rewarded
                idToGarbage[tokenId].rewardmonths += 1;
                idToGarbage[tokenId].penaltymonths = 0;

                (bool success, ) = (WMAPToken).call(
                    abi.encodeWithSignature(
                        "transfer(address,uint256)",
                        NFTOwner,
                        idToGarbage[tokenId].rewardPoints
                    )
                );
                require(success);
            } else if (idToGarbage[tokenId].rewardPoints == 16) {
                idToGarbage[tokenId].penaltymonths = 0;
                // user got no reward or penalty
            } else if (idToGarbage[tokenId].rewardPoints <= 15) {
                // user got penalty
                if (idToGarbage[tokenId].rewardPoints >= 1) {
                    idToGarbage[tokenId].rewardmonths -= 1;
                } else {
                    idToGarbage[tokenId].penaltymonths += 1;
                }
                if (idToGarbage[tokenId].penaltymonths == 3) {
                    console.log("your activity is suspicious and under review");
                }
            }
            idToGarbage[tokenId].garbageCollecteddays = 0;
            idToGarbage[tokenId].rewardPoints = 0;
        }
    }

    // fetch houses which having penalty for 3 months or more
    function fetchPenaltyHouses()
        public
        view
        returns (garbageCollection[] memory)
    {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToGarbage[i + 1].penaltymonths >= 3) {
                itemCount += 1;
            }
        }
        garbageCollection[] memory items = new garbageCollection[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToGarbage[i + 1].penaltymonths >= 3) {
                uint256 currentId = i + 1;
                garbageCollection storage currentItem = idToGarbage[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // get garbage collection details
    function getGarbageCollectionDetails(uint256 tokenId)
        public
        view
        returns (garbageCollection memory)
    {
        garbageCollection memory items = idToGarbage[tokenId];
        return items;
    }

    function getVehicleDetails()
        public
        view
        returns (garbageVehicles[] memory)
    {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToVehicle[i + 1].vehicle == msg.sender) {
                itemCount += 1;
            }
        }
        garbageVehicles[] memory items = new garbageVehicles[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToVehicle[i + 1].vehicle == msg.sender) {
                uint256 currentId = i + 1;
                garbageVehicles storage currentItem = idToVehicle[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
