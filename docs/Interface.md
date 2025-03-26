# Interface with Telemetry

- [Interface with Telemetry](#interface-with-telemetry)
  - [Message Received](#message-received)
  - [Message Sent](#message-sent)

```json
{
    "Timestamp": {
        "Altitude": 120,
        "Pressure": 1202
    }
}
```

## Message Received

```json
{
    "Timestamp": [
        {
            "Unit": "Flight_Estimator",
            "Measurements": {
                "Altitude": 1231,
                "Pressure": 1212,
                "Coordinates": [12, 12, 12]
            },
            "Status": {
                "Cam1": true,
                "Cam2": false
            },
            "Commands": {
                "Reset_Storage(201)": true,
                "Reset_Memory(202)": true
            }
        },
        {
            "Unit": "Telemetry",
            "Measurements": {
                "Altitude": 1231,
                "Pressure": 1212,
                "Coordinates": [12, 12, 12]
            },
            "Status": {
                "Cam1": true,
                "Cam2": false
            },
            "Commands": {
                "Reset_Storage(201)": true,
                "Reset_Memory(202)": true
            }
        }
    ]
}
```

## Message Sent

```json
{
    "Command (201)": true
}
```
