import { useCallback, useEffect, useState } from "react";

type EndlessScrollProps = {
    loadingRef: React.RefObject<HTMLElement>,
    paginatorFunction?: () => void
}

/**
 * hook for endless scroll effect.
 * @param loadingRef react ref used to calculate viewport and current progress
 * @param paginatorFunction a void function that gets activated whenever the ref is in the viewport
 */
export function useEndlessScroll({ loadingRef }: EndlessScrollProps): boolean {
    const [isInViewport, setIsInViewport] = useState(false);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        setIsInViewport(target.isIntersecting)
    }, []);

    const observerSettings = {
        root: null,
        rootMargin: "0px 0px 100px 0px",
        threshold: 1
    };

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, observerSettings);
        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }
    }, [handleObserver]);

    return isInViewport;
}