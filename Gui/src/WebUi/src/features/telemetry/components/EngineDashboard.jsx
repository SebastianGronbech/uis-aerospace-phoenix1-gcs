import { useState, useEffect, useRef } from "react";
import { useTelemetryHub } from "../hooks/useTelemetryHub";
import { TelemetryChart } from "./TelemetryChart";
import { useSignalR } from "@/shared/hooks/useSignalR";
import { HubConnectionBuilder } from "@microsoft/signalr";

// export const EngineDashboard = () => {
//     const { telemetryData, error, isConnected } = useTelemetryHub();
//     const [chartData, setChartData] = useState([]);

//     useEffect(() => {
//         if (telemetryData) {
//             const newChartData = telemetryData.map((data) => ({
//                 time: data.time,
//                 value: data.value,
//             }));
//             setChartData((prevData) => [...prevData, ...newChartData]);
//         }
//     }, [telemetryData]);

//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">
//                 Engine Dashboard{" "}
//                 {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
//             </h1>

//             {error && <p className="text-red-500">{error}</p>}

//             {isConnected ? (
//                 <div>
//                     {/* <h2 className="text-xl font-semibold">Telemetry Data</h2>
//                     <pre className="bg-gray-100 p-4 rounded">
//                         {JSON.stringify(telemetryData, null, 2)}
//                     </pre> */}

//                     <TelemetryChart telemetryData={chartData} />
//                 </div>
//             ) : (
//                 <p className="text-gray-500">Connecting to telemetry hub...</p>
//             )}
//         </div>
//     );
// };

export const EngineDashboard = () => {
    // // const { connected, data, sendCommand } = useTelemetryHub();
    // const [connection, setConnection] = useState(null);

    // const [data, setData] = useState(null);

    // const joinHub = async () => {
    //     try {
    //         const connection = new HubConnectionBuilder()
    //             .withUrl(`${import.meta.env.VITE_API_URL}/hubs/custom`)
    //             .withAutomaticReconnect()
    //             .configureLogging("info")
    //             .build();

    //         connection.on("ReceiveMessage", (data) => {
    //             setData(data);
    //             console.log("Received telemetry data:", data);
    //         });

    //         await connection.start();
    //         console.log("SignalR connection established");

    //         setConnection(connection);
    //     } catch (err) {
    //         console.error("Error establishing SignalR connection:", err);
    //     }
    // };

    // joinHub();

    // const [data, setData] = useState(null);

    // // Use the enhanced SignalR hook with message handlers
    // const { connected, error, sendCommand } = useSignalR({
    //     hubUrl: `${import.meta.env.VITE_API_URL}/hubs/custom`,
    //     messageHandlers: {
    //         ReceiveMessage: (receivedData) => {
    //             setData(receivedData);
    //             console.log("Received telemetry data:", receivedData);
    //         },
    //     },
    // });

    const [connected, setConnected] = useState(false);
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const connectionRef = useRef(null);

    // Setup SignalR connection
    useEffect(() => {
        // Create the connection
        const connection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/hubs/custom`)
            .withAutomaticReconnect()
            .configureLogging("info")
            .build();

        // Handle incoming telemetry data
        connection.on("ReceiveMessage", (receivedData) => {
            console.log("Received telemetry data:", receivedData);
            setData(receivedData);

            // Update chart data
            if (receivedData) {
                // If receivedData is an array, add all items, otherwise add as single item
                const newData = Array.isArray(receivedData)
                    ? receivedData
                    : [receivedData];

                setChartData((prevData) => {
                    const combined = [...prevData, ...newData];
                    // Optionally limit the number of data points to prevent memory issues
                    return combined.length > 100
                        ? combined.slice(-100)
                        : combined;
                });
            }
        });

        // Connection status handling
        connection.onclose(() => {
            console.log("SignalR connection closed");
            setConnected(false);
        });

        // Start the connection
        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR connection established");
                setConnected(true);
            } catch (err) {
                console.error("Error establishing SignalR connection:", err);
                // Retry connection after delay
                setTimeout(startConnection, 5000);
            }
        };

        startConnection();

        // Store connection in ref for use in sendCommand
        connectionRef.current = connection;

        // Clean up on unmount
        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Engine Dashboard{" "}
                {connected ? "🟢 Connected" : "🔴 Disconnected"}
            </h1>

            {data && (
                <div>
                    <h2 className="text-xl font-semibold">Telemetry Data</h2>
                    <pre className="bg-gray-100 p-4 rounded">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}

            {connected ? (
                <div>
                    <button
                        onClick={() => sendCommand("StartEngine")}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Start Engine
                    </button>
                    <button
                        onClick={() => sendCommand("StopEngine")}
                        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >
                        Stop Engine
                    </button>
                    <div>
                        <h2 className="text-xl font-semibold mt-4">
                            Telemetry Chart
                        </h2>

                        {chartData && chartData.length > 0 && (
                            <TelemetryChart telemetryData={chartData} />
                        )}
                        {/* <TelemetryChart telemetryData={data} /> */}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Connecting to telemetry hub...</p>
            )}
        </div>
    );
};
