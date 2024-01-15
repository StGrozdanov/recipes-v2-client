import useWebSocket from "react-use-websocket";

/**
 * just a wrapper hook that passes the notifications endpoint to the useWebSocket hook and returns it
 */
export const useNotificationsWebsocket = () => {
    return useWebSocket('wss://recipes-v2-server.fly.dev/realtime-notifications', {
        share: true,
    });
}