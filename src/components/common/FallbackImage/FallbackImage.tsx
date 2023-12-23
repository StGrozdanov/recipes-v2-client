type FallbackImageProps = {
    src: string,
    alt: string,
}

export default function FallbackImage({ src, alt }: FallbackImageProps) {
    src = src === null ? '' : src;

    return (
        <img
            src={src}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = alt;
            }}
        />
    );
}