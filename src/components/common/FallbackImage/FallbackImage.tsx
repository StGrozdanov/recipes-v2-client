type FallbackImageProps = {
    src: string,
    alt: string,
    className?: string
}

export default function FallbackImage({ src, alt, className }: FallbackImageProps) {
    src = src === null ? '' : src;

    return (
        <img
            className={className}
            src={src}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = alt;
            }}
        />
    );
}