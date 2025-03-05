const convertNetworkToImage = (networkid) => {
    let image = '/networks/ethereum.svg'
    switch (networkid) {
        case 1:
            image = '/networks/ethereum.svg'
            break;
        case 11155111:
            image = '/networks/sepolia.png'
            break;
        case 101:
            image = '/networks/solana.png'
            break;
        case 56:
            image = '/networks/bsc.png'
            break;
        default:
            image = '/networks/ethereum.svg'
            break;
    }
    return image;
}

export default convertNetworkToImage;