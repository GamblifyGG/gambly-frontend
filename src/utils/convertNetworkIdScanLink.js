function convertNetworkIdToScanLink(networkId) {
    let etherscanLink = '';

    switch (networkId) {
        case 1: // Mainnet
            etherscanLink = 'https://etherscan.io';
            break;
        // sepolia
        case 11155111:
            etherscanLink = 'https://sepolia.etherscan.io';
            break;
        // bsc
        case 56:
            etherscanLink = 'https://bscscan.com';
            break;
        default:
            etherscanLink = 'https://etherscan.io';
            break;
    }

    return etherscanLink;
}

module.exports = convertNetworkIdToScanLink;