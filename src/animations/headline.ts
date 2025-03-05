import anime from 'animejs';

export const fadeInUp = (element: HTMLElement, isScroll: boolean, delay?: number) => {
  const animationOptions = {
    targets: element,
    opacity: [0, 1],
    translateY: [100, 0],
    duration: 1000,
    delay: delay || 0,
    easing: 'easeOutExpo',
  };

  if (isScroll) {
    // Use scroll event to trigger animation
    const scrollTrigger = anime({
      ...animationOptions,
      autoplay: false,
    });

    const triggerAnimation = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
        scrollTrigger.play();
        window.removeEventListener('scroll', triggerAnimation);
      }
    };

    window.addEventListener('scroll', triggerAnimation);
    return; // No need to return the animation instance
  }

  anime(animationOptions);
};

export const scaleIn = (element: HTMLElement, isScroll: boolean) => {
  const animationOptions = {
    targets: element,
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 1000,
    easing: 'easeOutExpo',
  };

  if (isScroll) {
    // Use scroll event to trigger animation
    const scrollTrigger = anime({
      ...animationOptions,
      autoplay: false,
    });

    const triggerAnimation = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
        scrollTrigger.play();
        window.removeEventListener('scroll', triggerAnimation);
      }
    };

    window.addEventListener('scroll', triggerAnimation);
    return; // No need to return the animation instance
  }

  anime(animationOptions);
};
