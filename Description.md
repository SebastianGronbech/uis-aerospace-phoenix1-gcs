# Real-Time monitoring application

### Business Problem

-   **Objective**: Monitor and analyze real-time data from various telemetry modules within a space rocket.

-   **Challenges**: High-frequency data ingestion, maintaining historical records for post-flight analysis.

The system will receive time-series data from the ground station, and must be able to issue commands (e.g. recalibrate, open valve, kill engine, terminate, ...) to the different avionic modules (e.g. ECU, Flight Computer, Black box, ...). The system need to unsure strong security, minimal latency and use IAM.
