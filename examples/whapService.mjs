import * as ethers from "ethers";
import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

/*
 * This script is used to kill a player if the attacker is in the correct position.
 * The first argument is the private key of the attacker.
 * The second argument is the address of the victim.
 * e.g. node whapService.mjs 0x12341adf23xys_privatekey 0x12341adf23xys_address
 */

const KILL_WAIT_TIME = 10000;
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
const attackerPrivateAddress = args[0];
const victimAddress = args[1];

const attackerService = new EthersService(
  process.env.PROVIDER_URL,
  attackerPrivateAddress
);

await attackerService.initialize();

const attackerContract = new ethers.Contract(
  process.env.MAW_CONTRACT_ADDRESS,
  mawAbi,
  attackerService.signer
);

let countDown = KILL_WAIT_TIME / 1000;
const interval = setInterval(async () => {
  countDown >= 0 && console.log(`Kill in ${countDown} seconds...`);
  countDown -= 1;

  if (countDown <= 0) {
    try {
      await attackerContract.whap(victimAddress);
      console.log(`Whap ${victimAddress}`);
    } catch (error) {
      console.log("Cannot kill player", error);
    } finally {
      clearInterval(interval);
      process.exit(0);
    }
  }
}, 1000);
