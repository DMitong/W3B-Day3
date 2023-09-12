// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract VotingSystem {
    struct Elections {
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public hasVoted;
    Elections[] public elections;

    function createProposal(string memory _name) public {
        require(!hasVoted[msg.sender], "Already voted");

        elections.push(Elections({name: _name, voteCount: 0}));

        hasVoted[msg.sender] = true;
    }

    function vote(uint256 _electionIndex) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(_electionIndex < elections.length, "Invalid election index");

        hasVoted[msg.sender] = true;
        elections[_electionIndex].voteCount++;
    }

    function getelectionCount() public view returns (uint256) {
        return elections.length;
    }

    function getelection(
        uint256 _electionIndex
    ) public view returns (string memory, uint256) {
        require(_electionIndex < elections.length, "Invalid election index");

        Elections memory election = elections[_electionIndex];
        return (election.name, election.voteCount);
    }
}