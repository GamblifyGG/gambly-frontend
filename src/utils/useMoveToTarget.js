import { useAnimation } from 'framer-motion';

export const useMoveToTarget = (targetRef) => {
    const controls = useAnimation();

    const moveToTarget = () => {
        if (targetRef.current) {
            console.log("targetRef.current", targetRef.current)
            const targetRect = targetRef.current.getBoundingClientRect();
            console.log(targetRect)
            controls.start({
                x: targetRect.left,
                y: targetRect.top,
                transition: { type: 'spring' },
            });
        }
    };

    return moveToTarget;
};