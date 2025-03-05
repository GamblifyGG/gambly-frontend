import { useEffect, useState, useRef } from "react";

export function useIsVisible(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting)
    } 
    );
    
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return isIntersecting;
}

export function useBoolToggle(duration) {
  const [active, setActive] = useState(false)

  const toggle = () => {
    setActive(true)
    setTimeout(()=> setActive(false), duration)
  }

  return [active, toggle]
}