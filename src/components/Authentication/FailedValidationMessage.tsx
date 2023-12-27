import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import style from './Authenticate.module.scss';

type FailedValidationProps = { message: string }

export default function FailedValidationMessage({ message }: FailedValidationProps) {
    return (
        <>
            <FontAwesomeIcon icon={faExclamationTriangle} className={style['warning-icon']} />
            <span className={style['fail-validation-msg']}>{message}</span>
        </>
    );
}