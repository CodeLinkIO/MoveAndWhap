// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Move and Whap Game
 * @dev A simple game where you move in a square grid, turn, and whap.
 */
contract MAW {
    uint256 MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    event PlayerJoined(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir);
    event PlayerAttacked(address indexed attacker, address indexed victim);
    event PlayerMoved(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir);

    struct Player {
        uint256 posX; //Position on X
        uint256 posY;  //Position on Y
        uint8 direction; //Which direction you face. 0 North, 1 East, 2 South, 3 West
        bool isAlive; //Value to tell if the player exists in the game.
    }

    mapping(address => Player) public players;
    
    constructor() { }

    //Join game at position. Start somewhere in the spawn zone that is 256x256 in the middle.
    function join(uint8 x, uint8 y, uint8 dir) public {
        //Make sure the player is dead before they can join.
        require(!players[msg.sender].isAlive);

        uint256 middle = (MAX_INT/2)-128; //Middle of the map with 128 padding.
        uint256 startX = middle+uint256(x); //Add x to the middle position.
        uint256 startY = middle+uint256(y); //Add y to the middle position.
        uint8 _dir = dir % 4; //Make sure the player only has 0-4
        Player memory newPlayer = Player(startX, startY, _dir, true);
        players[msg.sender] = newPlayer;
        emit PlayerJoined(msg.sender, newPlayer.posX, newPlayer.posY, newPlayer.direction);
    }

    //Move in a direction and turn your character that direction. 
    //0 North, 1 East, 2 South, 3 West
    function move(uint8 dir) public {
        Player storage movingPlayer = players[msg.sender];
        require(movingPlayer.isAlive);

        //Get the direction of the player. Give a space of 2 at the border
        //of the map. It is a wrap around map.
        if(dir == 0) {
            movingPlayer.posY += 1;
            //Check if we are at the padded border
            if(movingPlayer.posY >= MAX_INT - 2) { 
                movingPlayer.posY = 2; //Send to other side.
            }
        } else if(dir == 1)
        {
            movingPlayer.posX += 1;
            if(movingPlayer.posX >= MAX_INT - 2) { 
                movingPlayer.posX = 2;
            }
        } else if(dir == 2)
        {
            movingPlayer.posY -= 1;
            if(movingPlayer.posY <= 2) { 
                movingPlayer.posY = MAX_INT - 2;
            }
        } else {
            movingPlayer.posX -= 1;
            if(movingPlayer.posX <= 2) { 
                movingPlayer.posX = MAX_INT - 2;
            }
        }

        //We never check the direction because the player only hurts themself if
        //they put a direction greater than 3.
        movingPlayer.direction = dir;
        emit PlayerMoved(msg.sender, movingPlayer.posX, movingPlayer.posY, movingPlayer.direction);
    }

    //Hit a person in front of you.
    //If they are facing you, they do not die.
    function whap(address target) public {
        //Check if they are both alive. No point killing a deadman.
        Player storage attacker = players[msg.sender];
        require(attacker.isAlive);
        Player storage victim = players[target];
        require(victim.isAlive);

        //Check if they are near by. They can be on top of each other.
        bool adjacentVertical = abs(int256(attacker.posY - victim.posY)) <= 1;
        bool adjacentHorizontal = abs(int256(attacker.posX - victim.posX)) <= 1;
        bool adjacentish = adjacentVertical || adjacentHorizontal;
        require(adjacentish);

        //Check to see if they are facing eachother.
        bool isFaceToFace = attacker.direction == 0 && victim.direction == 2;
        isFaceToFace = isFaceToFace || (attacker.direction == 2 && victim.direction == 0);
        isFaceToFace = isFaceToFace || (attacker.direction == 1 && victim.direction >= 3);
        isFaceToFace = isFaceToFace || (attacker.direction >= 3 && victim.direction == 1);
        require(!isFaceToFace);

        //If you made it this far, the victim is a dead boi.
        victim.isAlive = false;
        emit PlayerAttacked(msg.sender, target);
    }

    function abs(int256 x) private pure returns (int256) {
        return x >= 0 ? x : -x;
    }
}