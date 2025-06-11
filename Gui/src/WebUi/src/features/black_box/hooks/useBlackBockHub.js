import { useState, useEffect } from "react";
import { useSignalR } from "../../flight_estimator/hooks/useSignalR";

export const useBlackBoxHub = () => {
    const [blackBoxData, setBlackBoxData] = useState(null);

    const { connected, on, send } = useSignalR({
        hubUrl: `${import.meta.env.VITE_API_URL}/dashboardHub`,
        accessTokenFactory: () => localStorage.getItem("access_token"),
    });

    useEffect(() => {
        if (!connected) return;

        send("SubscribeToSubSystem", "black-box");

        const unsub = on("ReceiveSubSystemUpdate", (subId, eventName, data) => {
            if (subId !== "black-box" || eventName !== "black-box-update")
                return;

            setBlackBoxData(data);
        });

        return () => unsub();
    }, [connected, on, send]);

    return { blackBoxData, connected };
};
