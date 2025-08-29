// current_temp.tsx

export const fetchTemperature = async (lat: number, lng: number) => {
    const res = await fetch(
    `http://localhost:3000/climate/current?lat=${lat}&lng=${lng}`
);


    if (!res.ok) {
        throw new Error(`Failed to fetch temperature: ${res.statusText}`);
    }

    const data = await res.json();
    return data.temperature;
};
