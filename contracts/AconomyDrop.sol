// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./LibShare.sol";
import "./PNDC_ERC721.sol";

contract AconomyDrop is Ownable, IERC721Receiver {
    struct Claim {
        uint256 tokenId;
        uint256 endTime;
    }

    mapping(address => Claim[]) public s_userClaims;
    uint256 private constant claimPeriod = 1209600; //2 weeks
    address public PNDC;

    constructor(address _pndc) {
        PNDC = _pndc;
    }

    function safeMint(
        address _to,
        string memory _uri,
        LibShare.Share[] memory royalties
    ) external onlyOwner returns (uint256) {
        return PNDC_ERC721(PNDC).safeMint(_to, _uri, royalties);
    }

    function batchMint(
        uint256 _totalNft,
        string[] memory _uri,
        LibShare.Share[][] memory royaltiesSet
    ) external onlyOwner {
        PNDC_ERC721(PNDC).batchMint(_totalNft, _uri, royaltiesSet);
    }

    function createClaim(address _claimee, uint256 _tokenId)
        external
        onlyOwner
    {
        require(PNDC_ERC721(PNDC).ownerOf(_tokenId) == msg.sender);
        require(s_userClaims[_claimee].length <= 10);

        //needs approval
        PNDC_ERC721(PNDC).safeTransferFrom(msg.sender, address(this), _tokenId);

        Claim memory m_newClaim = Claim(
            _tokenId,
            block.timestamp + claimPeriod
        );
        s_userClaims[_claimee].push(m_newClaim);
    }

    function claim() external {
        uint256 m_totalClaims = s_userClaims[msg.sender].length;
        require(m_totalClaims != 0);
        for (uint256 i = 0; i < m_totalClaims; ++i) {
            if (block.timestamp <= s_userClaims[msg.sender][i].endTime) {
                PNDC_ERC721(PNDC).safeTransferFrom(
                    address(this),
                    msg.sender,
                    s_userClaims[msg.sender][i].tokenId
                );
            } else {
                PNDC_ERC721(PNDC).safeTransferFrom(
                    address(this),
                    owner(),
                    s_userClaims[msg.sender][i].tokenId
                );
            }
        }
        delete s_userClaims[msg.sender];
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
