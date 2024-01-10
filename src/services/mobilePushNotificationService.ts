import { useMutation } from "react-query";
import { NotificationActions } from "../constants/notificationActions";
import { useRequestHandler } from "../hooks/useRequestHandler";
import { useCallback } from "react";

type mobileNotificationProps = {
    subject: NotificationActions.NEW_COMMENT | NotificationActions.NEW_RECIPE,
    content: string,
}

/**
 * hook to handle mobile push notification requests
 * @returns all the related handlers
 */
export const useMobilePushNotification = () => {
    const { POST } = useRequestHandler();

    const useCreatePushNotification = () => {
        const {
            mutateAsync: createPushNotificationMutation,
            isLoading,
            isError
        } = useMutation((data: mobileNotificationProps) => {
            const response = POST(process.env.REACT_APP_NATIVE_NOTIFY_URL!,
                {
                    appId: process.env.REACT_APP_NATIVE_NOTIFY_APP_ID,
                    appToken: process.env.REACT_APP_NATIVE_NOTIFY_APP_TOKEN,
                    title: data.subject,
                    body: data.content,
                }
            );
            return response;
        });

        const createPushNotification = useCallback(async (data: mobileNotificationProps) => {
            try {
                const pushNotificationResponse = createPushNotificationMutation(data);
                return { pushNotificationResponse };
            } catch (error) {
                return { error };
            }
        }, [createPushNotificationMutation]);

        return { createPushNotification, isLoading, isError };
    };

    return { useCreatePushNotification }
}