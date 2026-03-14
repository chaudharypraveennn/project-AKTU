import { useState, useEffect } from "react"

export default function SolutionPanel({ solution }) {

    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(false)
    }, [solution])

    return (
        <div>

            <button
                onClick={() => setShow(!show)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
                {show ? "Hide Solution" : "Show Solution"}
            </button>

            {show && (

                <div className="mt-4 text-gray-700 animate-fadeIn">

                    <p>{solution}</p>

                </div>

            )}

        </div>
    )
}