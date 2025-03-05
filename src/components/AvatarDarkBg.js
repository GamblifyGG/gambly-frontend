import avatar from "nextjs-animal-avatar-generator"


function AvatarDarkBg({ customClass, playername, size = 60 }) {
    if (!playername) return null;
    const svg = avatar(playername, { size: size, backgroundColors: ['#13141b'] });

    return (
        <div className={`${customClass} rounded-full`} width="100%" height="100%" dangerouslySetInnerHTML={{ __html: svg }} />
    );
}

export default AvatarDarkBg;