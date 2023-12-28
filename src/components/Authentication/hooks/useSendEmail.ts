import { useState } from "react";
import emailjs from 'emailjs-com';

type EmailHandlerProps = {
    email: string,
    code: string,
    username: string,
}

/**
 * sends email using emailJS and form data reference
 * @returns handler to send emails with
 * @returns email is sent boolean that will signalise if the email was sent successfully or not
 */
export function useSendEmail() {
    const [emailIsSent, setEmailIsSent] = useState(false);
    const [emailSendError, setEmailSendError] = useState('');

    /**
    * email js send handler
    * @params event of a form data
    */
    const sendEmailHandler = ({ email, code, username }: EmailHandlerProps) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("code", code);
        formData.append("username", username);

        const serviceId = process.env.REACT_APP_EMAIL_JS_SERVICE as string;
        const templateId = process.env.REACT_APP_EMAIL_JS_TEMPLATE as string;
        const userId = process.env.REACT_APP_EMAIL_JS_TOKEN as string;

        const templateParams = Object.fromEntries(formData);

        emailjs
            .send(serviceId, templateId, templateParams, userId)
            .then(result => {
                if (result.text == 'OK') {
                    setEmailIsSent(true);
                } else {
                    setEmailSendError(`Email status: ${result.status}, message: ${result.text}`)
                }
            })
            .catch(err => setEmailSendError(err));
    }

    return {
        emailIsSent,
        emailSendError,
        sendEmailHandler,
    }
}