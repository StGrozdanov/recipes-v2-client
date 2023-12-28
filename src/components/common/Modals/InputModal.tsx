import { mountedStyleModal, unmountedStyleModal } from './utils/modalUnmountAndMountStyle';
import styles from './InputModal.module.scss';

interface InputModalProps {
    content: string,
    onConfirm: (...args: any[]) => void,
    onCancel: (...args: any[]) => void,
    data: string,
    setData: React.Dispatch<React.SetStateAction<string>>,
}

export default function InputModal({
    content,
    onConfirm,
    onCancel,
    data,
    setData
}: InputModalProps) {

    const setEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value
        setData(emailValue);
    };

    return (
        <article
            className={styles.container}
            style={content ? mountedStyleModal : unmountedStyleModal}
        >
            <h1 style={{color: 'white'}}>{content}</h1>
            <section className={styles['input-section']}>
                <input
                    type="text"
                    name="email"
                    placeholder="вашият имейл ..."
                    value={data}
                    onChange={setEmailHandler}
                />
            </section>
            <section className={styles['button-container']}>
                <button
                    className={styles['confirm-btn']}
                    onClick={onConfirm}
                >
                    Потвърди
                </button>
                <button
                    className={styles['cancel-btn']}
                    onClick={onCancel}
                >
                    Затвори
                </button>
            </section>
        </article>
    );
}