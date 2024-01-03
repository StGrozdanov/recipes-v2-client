import { mountedStyleModal, unmountedStyleModal } from '../utils/modalUnmountAndMountStyle';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
    content: string,
    onConfirm: (...args: any[]) => void,
    onCancel: (...args: any[]) => void,
}

export default function ConfirmModal({ content, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <article
            className={styles.container}
            style={content ? mountedStyleModal : unmountedStyleModal}
        >
            <h1>{content}</h1>
            <section className={styles['button-container']}>
                <button
                    className={styles['confirm-btn']}
                    onClick={onConfirm}
                >
                    Confirm
                </button>
                <button
                    className={styles['cancel-btn']}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </section>
        </article>
    );
}