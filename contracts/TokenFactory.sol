// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

contract TokenFactory{
    mapping(address => address) public collectionToOwner;

    function addCollection(address _collection) external {
        collectionToOwner[_collection] = msg.sender;
    }
}