import * as ethers from "ethers";
import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

/*
 * This script is used to move a player in direction.
 * The first argument is the private key of the player.
 * The following argument is the direction to move (0-3).
 * 0: DOWN_DIRECTION,
 * 1: RIGHT_DIRECTION,
 * 2: UP_DIRECTION,
 * 3: LEFT_DIRECTION,
 * e.g. node moveService.mjs 0x12341adf23xys 0
 */

const MOVE_WAIT_TIME = 1000;
const mawAbi = [
  "constructor()",
  "function join(int8 x, int8 y, uint8 dir)",
  "function move(uint8 dir)",
  "function whap(address target)",
  "event PlayerJoined(address indexed player, int256 indexed x, int256 indexed y, int8 dir)",
  "event PlayerMoved(address indexed player, int256 indexed x, int256 indexed y, int8 dir)",
  "event PlayerAttacked(address indexed attacker, address indexed victim)",
];

const args = process.argv.slice(2);
const privateAddress = args[0];
const moveDirection = args[1];

const service = new EthersService(process.env.PROVIDER_URL, privateAddress);
await service.initialize();

const contract = new ethers.Contract(
  process.env.MAW_CONTRACT_ADDRESS,
  mawAbi,
  service.signer
);

let countDown = MOVE_WAIT_TIME / 1000;
const interval = setInterval(async () => {
  countDown >= 0 && console.log(`Move in ${countDown} seconds...`);
  countDown -= 1;

  if (countDown <= 0) {
    try {
      await contract.move(moveDirection);
      console.log(`Move ${moveDirection}`);
    } catch (error) {
      console.log("Cannot move player", error);
    } finally {
      clearInterval(interval);
      process.exit(0);
    }
  }
}, 1000);
