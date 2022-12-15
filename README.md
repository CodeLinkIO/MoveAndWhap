# Move and Whap
A simple PixiJS game where you move and whap!

### Install Backend
- Ensure you have node version **19.0.0** installed. No other version has been tested.
- In the root of the project: **npm** *install*

### Environment Config Backend
- In the root of the project, make a file called **.env**
- Add these parameters:
    - **PROVIDER_URL**: Your Avalanche provider url.
        - You can use the Avalanche public RPCs but for the examples you'll need to adjust the EventTrackingService chunkTime to a higher number. In the examples it is set to 0.1 seconds for Quicknode paid service. You'll need to change them to 1-2 second wait times, otherwise you could be banned from the node for 12 hours.
        - You can signup with a Quicknode free account and get 250ms rate limit. We used Quicknode for the entire development of this project.
        - **MAINNET**: https://api.avax.network/ext/bc/C/rpc
        - **FUJI**: https://api.avax-test.network/ext/bc/C/rpc
        - **QUICKNODE**: Make sure to add **/ext/bc/C/rpc** to the end of your Quicknode url.
    - **WSS_PROVIDER_URL**: Your Avalanche websocket url.
        - Again, you can use the public RPCs for this, but you may get banned for 12 hours if you do not properly rate limit yourself. Quicknode free account automatically provides you with an https and wss endpoint you can use.
        - **MAINNET**: wss://api.avax.network/ext/bc/C/ws
        - **FUJI**: wss://api.avax-test.network/ext/bc/C/ws
        - **QUICKNODE**: After you copy the Quicknode url, make sure to add **/ext/bc/C/rpc** at the end.
    - **PRIVATE_KEY**: A private key to an address you control.
        - This will be used to make automatic moves.
    - **PRIVATE_ADDRESS**: The address to the private key.
    - **FUJI_URL**: Your Avalanche Fuji Net provider.
        - The Fuji provider url. Specifically used to deploy the contract on the Fuji Network with hardhat. You can use a third party provider or a the public one. There should be no problems with using the public one.
    - **FUJI_DEPLOY_KEY**: A private key of an address on the Fuji Net.
        - This address needs some amount of Avax in it to deploy the contract on the network.
    - **MAW_CONTRACT_ADDRESS**: The address where the contract was deployed.
    - **MAW_START**: The first block that the contract was deployed on.
    - **WS_PORT**=7070
        - This the Web Socker Server port for the EventTracking service. It is used to feed events to a client.
        - If you end up needing that port, you can change the Web Socket Server port here. There is no particular reason for being 7070.

### Running Backend Examples.
