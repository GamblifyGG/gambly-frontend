import { useEffect } from 'react';


const ImagePreloader = () => {

    const cardUrls = [
        '/cards/set1/2C.png',
        '/cards/set1/2D.png',
        '/cards/set1/2H.png',
        '/cards/set1/2S.png',
        '/cards/set1/3C.png',
        '/cards/set1/3D.png',
        '/cards/set1/3H.png',
        '/cards/set1/3S.png',
        '/cards/set1/4C.png',
        '/cards/set1/4D.png',
        '/cards/set1/4H.png',
        '/cards/set1/4S.png',
        '/cards/set1/5C.png',
        '/cards/set1/5D.png',
        '/cards/set1/5H.png',
        '/cards/set1/5S.png',
        '/cards/set1/6C.png',
        '/cards/set1/6D.png',
        '/cards/set1/6H.png',
        '/cards/set1/6S.png',
        '/cards/set1/7C.png',
        '/cards/set1/7D.png',
        '/cards/set1/7H.png',
        '/cards/set1/7S.png',
        '/cards/set1/8C.png',
        '/cards/set1/8D.png',
        '/cards/set1/8H.png',
        '/cards/set1/8S.png',
        '/cards/set1/9C.png',
        '/cards/set1/9D.png',
        '/cards/set1/9H.png',
        '/cards/set1/9S.png',
        '/cards/set1/10C.png',
        '/cards/set1/10D.png',
        '/cards/set1/10H.png',
        '/cards/set1/10S.png',
        '/cards/set1/JC.png',
        '/cards/set1/JD.png',
        '/cards/set1/JH.png',
        '/cards/set1/JS.png',
        '/cards/set1/QC.png',
        '/cards/set1/QD.png',
        '/cards/set1/QH.png',
        '/cards/set1/QS.png',
        '/cards/set1/KC.png',
        '/cards/set1/KD.png',
        '/cards/set1/KH.png',
        '/cards/set1/KS.png',
        '/cards/set1/AC.png',
        '/cards/set1/AD.png',
        '/cards/set1/AH.png',
        '/cards/set1/AS.png',
        '/cards/set1/gray_back.png',
    ];
    // const ImagePreloader = () => {
    useEffect(() => {
        cardUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }, [cardUrls]);

    return null;
    // };
}

export default ImagePreloader;