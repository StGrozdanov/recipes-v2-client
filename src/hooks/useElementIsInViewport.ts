import { useState, useEffect, useRef } from "react";

/**
 * Checks if the element is in the user viewport and returns a boolean value
 * @param ref react ref
 * @param viewportThreshold 
 * @returns 
 */
export const useElementIsInViewport = (
    ref: React.RefObject<HTMLElement>,
    viewportThreshold = '-100px'
): boolean => {
    const [isInViewport, setIsInViewport] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const options: IntersectionObserverInit = {
        threshold: 1,
        rootMargin: `0px 0px ${viewportThreshold} 0px`,
    };

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInViewport(true);
            }
        }, options);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [options]);

    useEffect(() => {
        try {
            if (ref.current && observerRef.current) {
                observerRef.current.observe(ref.current);
            }

            return () => {
                if (observerRef.current) {
                    observerRef.current.disconnect();
                }
            };
        } catch (err) {
            console.error(err);
        }
    }, [ref, options]);

    return isInViewport;
};
