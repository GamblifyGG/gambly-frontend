function convertNetworkID(networkID) {
    networkID = parseInt(networkID);
    let readableID = "";
    switch (networkID) {
        case 1:
            readableID = "ethereum";
            break;
        case 11155111:
            readableID = "sepolia";
            break;
        case 101:
            readableID = "solana";
            break;
        case 56:
            readableID = "bsc";
            break;
        default:
            readableID = "ethereum";
            break;
    }

    return readableID;
}

function convertNetworkIDToSymbol(networkID) {
    networkID = parseInt(networkID);
    let symbol = "";
    switch (networkID) {
        case 1:
            symbol = "ETH";
            break;
        case 11155111:
            symbol = "SPO";
            break;
        case 101:
            symbol = "SOL";
            break;
        case 56:
            symbol = "BSC";
            break;
        default:
            symbol = "ETH";
            break;
    }

    return symbol;

}

const convertNetworkNameToId = (networkName) => {
    console.log("Converting network name to ID", networkName)
    networkName = networkName.toLowerCase();
    let networkID = 1;
    switch (networkName) {
        case "ethereum":
            networkID = 1;
            break;
        case "sepolia":
            networkID = 11155111;
            break;
        case "solana":
            networkID = 101;
            break;
        case "bsc":
            networkID = 56;
            break;
        default:
            networkID = 1;
            break;
    }
    return networkID;
}

module.exports = {
    convertNetworkID,
    convertNetworkNameToId,
    convertNetworkIDToSymbol
}
