// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Move and Whap Game
 * @dev A simple game where you move in a square grid, turn, and whap.
 */
contract MAW {
    int256 MAX_INT = type(int256).max;
    int256 MIN_INT = type(int256).min;

    event PlayerJoined(address indexed player, int256 indexed x, int256 indexed y, uint8 dir);
    event PlayerAttacked(address indexed attacker, address indexed victim);
    event PlayerMoved(address indexed player, int256 indexed x, int256 indexed y, uint8 dir);

    struct Player {
        int256 posX; //Position on X
        int256 posY;  //Position on Y
        uint8 direction; //Which direction you face. 0 North, 1 East, 2 South, 3 West
        bool isAlive; //Value to tell if the player exists in the game.
    }

    mapping(address => Player) public players;
    
    constructor() { }

    //Join game at position. Start somewhere in the spawn zone that is 256x256 in the middle.
    function join(int8 x, int8 y, uint8 dir) public {
        //Make sure the player is dead before they can join.
        require(!players[msg.sender].isAlive, "Player already exists in world.");

        int256 startX = int256(x); //Add x to the middle position.
        int256 startY = int256(y); //Add y to the middle position.
        uint8 _dir = dir % 4; //Make sure the player only has 0-4
        Player memory newPlayer = Player(startX, startY, _dir, true);
        players[msg.sender] = newPlayer;
        emit PlayerJoined(msg.sender, newPlayer.posX, newPlayer.posY, newPlayer.direction);
    }

    //Move in a direction and turn your character that direction. 
    //0 North, 1 East, 2 South, 3 West
    function move(uint8 dir) public {
        Player storage movingPlayer = players[msg.sender];
        require(movingPlayer.isAlive, "Player does not exist in the world.");
        
        //Make sure the player direction is 0,1,2, or 3;
        uint8 realDir = dir % 4;

        //Get the direction of the player. Give a space of 2 at the border
        //of the map. It is a wrap around map.
        if(realDir == 0) {
            movingPlayer.posY += 1;
            //Check if we are at the padded border
            if(movingPlayer.posY >= MAX_INT - 2) { 
                movingPlayer.posY = MIN_INT + 2; //Send to other side.
            }
        } else if(realDir == 1)
        {
            movingPlayer.posX += 1;
            if(movingPlayer.posX >= MAX_INT - 2) { 
                movingPlayer.posX = MIN_INT + 2;
            }
        } else if(realDir == 2)
        {
            movingPlayer.posY -= 1;
            if(movingPlayer.posY <= MIN_INT + 2) { 
                movingPlayer.posY = MAX_INT - 2;
            }
        } else {
            movingPlayer.posX -= 1;
            if(movingPlayer.posX <= MIN_INT + 2) { 
                movingPlayer.posX = MAX_INT - 2;
            }
        }

        movingPlayer.direction = realDir;
        emit PlayerMoved(msg.sender, movingPlayer.posX, movingPlayer.posY, movingPlayer.direction);
    }

    //Hit a person in front of you.
    //If they are facing you, they do not die.
    function whap(address target) public {
        //Check if they are both alive. No point killing a deadman.
        Player storage attacker = players[msg.sender];
        require(attacker.isAlive, "Attacker does not exist in the world.");
        Player storage victim = players[target];
        require(victim.isAlive, "Victim does not exist in the world.");

        //Check if the victim is in front of the player.
        bool sameX = attacker.posX == victim.posX;
        bool sameY = attacker.posY == victim.posY;
        uint8 victimPosition = 255;

        //Set "victimPosition" to the direction the attacker would need to be facing.
        if(victim.posY == attacker.posY + 1 && sameX) { victimPosition = 0; }
        else if(victim.posX == attacker.posX + 1 && sameY) { victimPosition = 1; }
        else if(victim.posY == attacker.posY - 1 && sameX) { victimPosition = 2; }
        else if(victim.posX == attacker.posX - 1 && sameY) { victimPosition = 3; }

        bool isInFront = attacker.direction == victimPosition;
        require(isInFront, "Victim is not in front of the attacker.");

        //Check to see if they are facing eachother.
        //Simple math check to see if the directions are exact opposite.
        int faceToFaceOffset = int8(attacker.direction) - int8(victim.direction);
        bool isFaceToFace = abs(faceToFaceOffset) == 2;
        require(!isFaceToFace, "Attacker can not attack a victim facing them.");

        //If you made it this far, the victim is a dead boi.
        victim.isAlive = false;
        emit PlayerAttacked(msg.sender, target);
    }

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }

    function getPlayer(address player) public view returns (int256,int256,uint8,bool) {
        Player memory p = players[player];
        return (p.posX, p.posY, p.direction, p.isAlive);
    }
}