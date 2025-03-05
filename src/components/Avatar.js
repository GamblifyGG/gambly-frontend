import avatar from "nextjs-animal-avatar-generator"


function Avatar({ playername, size = 60 }) {
    if(!playername) return null;
    const svg = avatar(playername, { size: size, backgroundColors: ['#141920'] });

    return (
        <div width="100%" height="100%" dangerouslySetInnerHTML={{ __html: svg }} />
    );
}

export default Avatar;