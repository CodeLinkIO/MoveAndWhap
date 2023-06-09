avalanche_module = import_module("github.com/kurtosis-tech/avalanche-package/main.star")

#Backend Info
MNW_BE="trileeee/movenwhap-be:0.0.1"
BE_WS_PORT=7070
PRIVATE_KEY="56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"
ACCOUNT="0x8db97c7cece249c2b98bdc0226cc4c2a57bf52fc"


def run(plan, args):
    rpc_urls, subnet_id, chain_rpc_url = init_chain_connection(plan, args)
    plan.print(rpc_urls)
    contract_address = deploy_contract(plan,chain_rpc_url)
    be_ip = setup_be(plan, chain_rpc_url, contract_address)
    plan.print("Contract Address: {}".format(contract_address))

# Start up a local subnet
def init_chain_connection(plan, args):
    plan.print("Spinning up a local Avalanche chain and connecting to it")
    output = avalanche_module.run(plan, args)

    rpc_urls = output["rpc-urls"]
    subnet_id = output["subnet id"]
    chain_id = output["chain id"]
    vm_id= output["vm id"]
    validator_ids = output["validator ids"]
    chain_rpc_url = output["chain-rpc-url"]
    chain_id = output["chain genesis id"]
    return rpc_urls, subnet_id, chain_rpc_url

# Deploy the game contract to the subnet
def deploy_contract(plan, chain_rpc_url):
    service_name="contract-deployer"
    plan.print(chain_rpc_url)
    plan.add_service(
        name=service_name,
        config=ServiceConfig(
            image=MNW_BE,
            env_vars={
                "PROVIDER_URL": chain_rpc_url
            },
            cmd=["tail", "-f", "/dev/null"]
        )
    )

    prepare_exec_data = ExecRecipe(command = ["sh", "-c", "npx hardhat test"])
    prepare_result = plan.exec(
        service_name=service_name,
        recipe=prepare_exec_data,
    )

    result_command = "npx hardhat run --network local_subnet ./contracts/scripts/deployer2.js"
    exec_data = ExecRecipe(command = ["sh", "-c", result_command])
    result = plan.exec(
        service_name=service_name,
        recipe=exec_data,
    )
    contract_address = result["output"]
    plan.print(contract_address)
    plan.remove_service(service_name)
    return contract_address

# Start up Backend
def setup_be(plan, chain_rpc_url, contract_address):
    be_service = plan.add_service(
        name="mnw-be",
        config=ServiceConfig(
            image=MNW_BE,
            env_vars={
                "PROVIDER_URL": chain_rpc_url,
                "MAW_CONTRACT_ADDRESS": contract_address,
                "MAW_START":str(0),
                "WS_PORT": str(BE_WS_PORT),
                "PRIVATE_KEY": PRIVATE_KEY,
                "ACCOUNT": ACCOUNT
            },
            ports = {
                "websocket": PortSpec(number = BE_WS_PORT, transport_protocol = "TCP", wait = None),
            }
        )
    )
    be_ip = be_service.ip_address
    return be_ip
