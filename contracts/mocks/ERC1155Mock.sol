// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Mock is ERC1155, Ownable {
	constructor() ERC1155("") {
		mint(msg.sender, 0, 1, "");
		mint(msg.sender, 1, 1, "");
		mint(msg.sender, 2, 1, "");
		mint(msg.sender, 3, 1, "");
		mint(msg.sender, 4, 1, "");
		mint(msg.sender, 5, 1, "");
		mint(msg.sender, 6, 1, "");
		mint(msg.sender, 7, 1, "");
		mint(msg.sender, 8, 1, "");
		mint(msg.sender, 9, 1, "");
	}

	function mint(
		address to,
		uint256 id,
		uint256 amount,
		bytes memory data
	) public virtual onlyOwner {
		_mint(to, id, amount, data);
	}
}
