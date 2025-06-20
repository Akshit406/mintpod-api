// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFTCollection.sol";

contract MintFactory {
    event CollectionDeployed(address collectionAddress, address owner);

    function deployNewCollection(
        string memory name,
        string memory symbol
    ) public returns (address) {
        NFTCollection newNFT = new NFTCollection(name, symbol, msg.sender);
        emit CollectionDeployed(address(newNFT), msg.sender);
        return address(newNFT);
    }
}
