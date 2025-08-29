// HeatAlertList.tsx
import React, { useEffect, useState } from "react";
import HeatAlert from "./HeatAlert";

interface HeatAlertData {
    city: string;
    temperature: number;
    severity: "warning" | "extreme" | "normal";
    time_ago: string;
}

export default function HeatAlertList() {
    const [heatAlerts, setHeatAlerts] = useState<HeatAlertData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHeatAlerts() {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:3000/heat_alert/api/heat_alert");
                if (!res.ok) throw new Error("Failed to fetch heat alerts");
                const data = await res.json();
                setHeatAlerts(data);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        fetchHeatAlerts();
        const interval = setInterval(fetchHeatAlerts, 21600000); // 6 hours
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p>Loading heat alerts...</p>;
    if (error) return <p>Error loading heat alerts: {error}</p>;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heatAlerts.map((alert, index) => (
                <HeatAlert
                    key={index}
                    city={alert.city}
                    temperature={alert.temperature}
                    severity={alert.severity}
                    time_ago={alert.time_ago}
                />
            ))}
        </div>
    );
}