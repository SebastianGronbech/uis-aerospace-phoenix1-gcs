import { useState, useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

// export const useTelemetryHub = () => {
//     const [telemetryData, setTelemetryData] = useState(null);
//     const [error, setError] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);

//     const { connection } = useSignalR("http://localhost:5017/hubs/custom", {
//         withCredentials: true,
//         accessTokenFactory: () => localStorage.getItem("access_token"),
//     });

//     useEffect(() => {
//         const handleTelemetryData = (data) => {
//             setTelemetryData(data);
//         };

//         const handleError = (err) => {
//             setError(err);
//         };

//         if (connection) {
//             connection.on("ReceiveTelemetryData", handleTelemetryData);
//             connection.on("Error", handleError);
//             connection.onclose(() => {
//                 setIsConnected(false);
//             });
//             connection.onreconnecting(() => {
//                 setIsConnected(false);
//             });
//             connection.onreconnected(() => {
//                 setIsConnected(true);
//             });

//             return () => {
//                 connection.off("ReceiveTelemetryData", handleTelemetryData);
//                 connection.off("Error", handleError);
//             };
//         }
//     }, [connection]);

//     return { telemetryData, error, isConnected };
// };

export const useTelemetryHub = () => {
    const [telemetryData, setTelemetryData] = useState(null);
    const { connected, on, send } = useSignalR(
        {
            hubUrl: `${baseUrl}/hubs/custom`,
            accessTokenFactory: () => localStorage.getItem("access_token"),
        }
        // {
        //     accessTokenFactory: () => localStorage.getItem("access_token"),
        //     withCredentials: true,
        // }
    );

    useEffect(() => {
        const unsubscribe = on("ReceiveTelemetryData", (data) => {
            setTelemetryData(data);
        });

        return unsubscribe;
    }, [on]);

    return {
        connected,
        telemetryData,
        send: (command) => send("SendCommand", command),
    };
};
