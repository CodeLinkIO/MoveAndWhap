eth_network_package = import_module("github.com/kurtosis-tech/eth-network-package/main.star")
# this import works from any Kurtosis pacakge or script anywhere
hardhat_module = import_module("github.com/kurtosis-tech/web3-tools/hardhat.star")

def run(plan, args):
    # Etheruem network setup
    participants, _ = eth_network_package.run(plan, args)
    el_client_rpc_ip_addr = participants[0].el_client_context.ip_addr
    el_client_rpc_port = participants[0].el_client_context.rpc_port_num
    rpc_url = "http://{0}:{1}".format(el_client_rpc_ip_addr, el_client_rpc_port)

    # we pass the rpc URL of any of the ethereum nodes inside Docker as environment variables
    # look at smart-contract-example/hardhat.config.ts to see how the variable is read and passed further
    hardhat_env_vars = {
        "RPC_URI": rpc_url
    }
    # this can be any folder containing the hardhat.config.ts and other hardhat files
    # this has to be a part of a Kurtosis package (needs a kurtosis.yml) at root
    hardhat_project = "github.com/CodelinkIO/MoveAndWhap/tree/trile/mnw-be-kurtosis-package"

    # we initialize the hardhat module passing the hardhat_project & hardhat_env_vars
    # the hardhat_env_vars argument is optional and defaults to None
    hardhat = hardhat_module.init(plan, hardhat_project, hardhat_env_vars)
    
    # we run the `balances` task in the hardhat.config.ts; note that the default network is `local`
    # we override it to localnet here
    hardhat_module.task(plan, "balances", "localnet")

    # this runs npx hardhat compile in the hardhat_project mentioned above
    hardhat_module.compile(plan)

    # this runs npx hardhat run scripts/deploy.ts --network localnet
    # note that the "localnet" is optional; if it wasn't passed it would have defaulted to local
    hardhat_module.run(plan, "contracts/scripts/deployer.ts", "localnet")

    # this runs npx hardhat test test/chiptoken.js --network localnet
    # note that the "localnet" is optional; if it wasn't passed it would have defaulted to local
    # hardhat_module.run(plan, "test/chiptoken.js", "localnet")
    
    # this just removes the started container
    hardhat_module.cleanup(plan)