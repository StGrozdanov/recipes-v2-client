import { AnimationOnScroll } from "react-animation-on-scroll";

interface AnimateProps {
    children: React.ReactNode,
    animationName: string,
    animateOnce?: boolean,
    delay?: number,
    className?: string | undefined,
    duration?: number,
}

export default function Animate({
    children,
    animationName,
    animateOnce,
    delay,
    className,
    duration
}: AnimateProps) {
    return (
        <AnimationOnScroll
            animateIn={`animate__${animationName}`}
            animateOnce={animateOnce ? animateOnce : true}
            delay={delay}
            className={className}
            duration={duration}
        >
            {children}
        </AnimationOnScroll>
    );
}