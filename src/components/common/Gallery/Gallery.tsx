import styles from "./Gallery.module.scss"

interface GalleryProps {
    text?: string | undefined;
}

export default function Gallery({ text }: GalleryProps) {

    return (
        <div className={styles.gallery}>
            <h1>Gallery {text}</h1>
        </div>
    )
}
