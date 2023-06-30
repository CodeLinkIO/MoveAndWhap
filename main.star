avalanche_module = import_module("github.com/kurtosis-tech/avalanche-package/main.star")
hardhat_module = import_module("github.com/kurtosis-tech/web3-tools/hardhat.star")

def run(plan, args):
    rpc_urls, subnet_id, chain_rpc_url = init_chain_connection(plan, args)
    plan.print(chain_rpc_url)

    hardhat_env_vars = {
        "RPC_URI": chain_rpc_url
    }
    # # We will update this to "github.com/CodelinkIO/MoveAndWhap" when this branch is merged and main.star is seen in the default branch
    hardhat_project = "github.com/CodelinkIO/MoveAndWhap/kurtosis-package"

    hardhat = hardhat_module.init(plan, hardhat_project, hardhat_env_vars)
    hardhat_module.compile(plan)
    hardhat_module.run(plan, "contracts/scripts/deployer.js", "local_subnet")
    hardhat_module.cleanup(plan)

def init_chain_connection(plan, args):
    plan.print("Spinning up a local Avalanche chain and connecting to it")
    output = avalanche_module.run(plan, args)

    rpc_urls = output["rpc-urls"]
    chain_id = output["chain id"]
    subnet_id = output["subnet id"]
    chain_rpc_url = output["chain-rpc-url"]
    return rpc_urls, subnet_id, chain_rpc_url