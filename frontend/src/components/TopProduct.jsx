import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";

export default function TopProduct({ title, fetchFunc }) {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            try {
                // nếu fetchFunc là function thì gọi nó, nếu là Promise thì await trực tiếp
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

    console.log(results)

    let firstRow = [];
    let secondRow = [];
    if (results != null) {
        firstRow = results.slice(0, 2);
        secondRow = results.slice(2, 5);
    }

    return (
        <>
            <h1 className="mt-5 d-flex justify-content-center">{title}</h1>
            <div className="mt-1 bg-body-secondary top-container">
                <div className="scaled-container">
                    <div className="row mb-3 pt-4 justify-content-md-center">
                        {firstRow.map((e, idx) => (
                            <div key={idx} className="col col-md-4 d-flex justify-content-center">
                                <ItemCard item={e}></ItemCard>
                            </div>
                        ))}
                    </div>

                    <div className="row justify-content-md-center">
                        {secondRow.map((e, idx) => (
                            <div key={idx + 2} className="col col-md-4 d-flex justify-content-center">
                                <ItemCard item={e}></ItemCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}