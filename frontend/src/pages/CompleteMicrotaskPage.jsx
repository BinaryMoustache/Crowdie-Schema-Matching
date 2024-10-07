import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import MicrotaskDetails from '../components/Crowd/MicrotaskDetails';
import classes from "./CompleteMicrotaskPage.module.css"

function CompleteMicrotaskPage() {
    const { taskId } = useParams();
    const [microtask, setMicrotask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMicrotask();
    }, [taskId]);

    const fetchMicrotask = async () => {
        setLoading(true);
        setError(null);
        const token = getAuthToken();

        try {
            console.log(`Fetching microtask for task ID: ${taskId}`);
            const response = await fetch(`http://localhost:8000/tasks/microtask/${taskId}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to load microtask: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            setMicrotask(data);
            console.log(data)
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to load microtask.");
        } finally {
            setLoading(false);
        }
    };

    const handleNextMicrotask = () => {
        fetchMicrotask();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!microtask) return <div>No more microtasks available.</div>;

    const rows1 = microtask.rows_1.split(",");
    const rows2 = microtask.rows_2.split(",");

    return (
        <div className={classes.container}>
            <div className={classes.infoContainer}>
            <h2>Complete Microtask</h2>
            </div>
            <MicrotaskDetails data={microtask}/>
        </div>
    );
}

export default CompleteMicrotaskPage;
