import useWebSocket from "react-use-websocket";

const NOTIFICATIONS_WEBSOCKET_URL = process.env.REACT_APP_DEV_WEBSOCKET_URL || process.env.REACT_APP_WEBSOCKET_URL;

/**
 * just a wrapper hook that passes the notifications endpoint to the useWebSocket hook and returns it
 */
export const useNotificationsWebsocket = () => {
    return useWebSocket(NOTIFICATIONS_WEBSOCKET_URL!, {
        share: true,
    });
}