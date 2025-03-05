import React from 'react';
import { useSpring, animated } from 'react-spring';

const FadeInComponent = ({ children }) => {
    const fadeInStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 100 },
    });

    return <animated.div style={fadeInStyles}>{children}</animated.div>;
};

export default FadeInComponent;