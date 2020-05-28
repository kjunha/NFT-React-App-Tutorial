pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Color is ERC721Full {

    //Array contains all the colors has been minted
    string[] public colors;

    //Colors already exist (Dictionary Lookup)
    mapping(string => bool) _colorExists;

    constructor() ERC721Full("Color", "COLOR") public {}

    function mint(string  memory _color) public {
        //Require uniqie color
        require(!_colorExists[_color]);
        //Take Color, add it
        uint _id = colors.push(_color);
        //Call the mint function
        _mint(msg.sender, _id);
        //Track Color
        _colorExists[_color] = true;
    }

}