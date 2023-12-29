type FallbackImageProps = {
    src: string | null,
    alt: string,
    className?: string
}

export default function FallbackImage({ src, alt, className }: FallbackImageProps) {
    return (
        <img
            className={className}
            src={src === null ? '' : src}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = alt;
            }}
        />
    );
}