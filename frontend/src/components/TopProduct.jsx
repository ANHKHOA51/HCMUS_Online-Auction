import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import './style.css'

export default function TopProduct({ title, fetchFunc }) {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            try {
                const res = await (typeof fetchFunc === "function" ? fetchFunc() : fetchFunc);
                if (mounted) setResults(res);
            } catch (err) {
                console.error(err);
                if (mounted) setError(err);
            }
        }
        fetchData();
        return () => { mounted = false; };
    }, []);

    return (
        <>
            <h1 className="mt-2 d-flex justify-content-center fw-bold">{title}</h1>
                <div className="top-container">
                    {results.map((e, idx) => (
                        <div key={idx} className="scaled-container">
                            <ItemCard item={e}></ItemCard>
                        </div>
                    ))}
                </div>

        </>
    )
}