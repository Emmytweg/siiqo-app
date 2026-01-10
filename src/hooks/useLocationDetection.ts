import { useState, useCallback, useEffect } from "react";

export const useLocationDetection = () => {
    const [location, setLocation] = useState({ country: "", state: "", latitude: "", longitude: "" });
    const [loading, setLoading] = useState(false);
    const [detected, setDetected] = useState(false);

    const detectLocation = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("https://ipapi.co/json/", {
      headers: {
        'User-Agent': '', // Good practice to identify your user agent
      },
      cache: 'no-store'
    });
            const data = await response.json();


            if (data.country_name && data.region) {
                const newLocation = { country: data.country_name, state: data.region, latitude: data.latitude, longitude: data.longitude };
                setLocation(newLocation);
                setDetected(true);
                return `${newLocation.state}, ${newLocation.country}`;
            } else {
                throw new Error("Incomplete data");
            }
        } catch {
            console.warn("Location detection failed");
            return "N/A";
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    return { location, loading, detected, refresh: detectLocation };
};