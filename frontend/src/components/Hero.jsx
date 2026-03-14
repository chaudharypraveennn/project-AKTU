export default function Hero({ onStart }){

    return(

        <div className="max-w-6xl mx-auto px-6 py-20 text-center">

            <h1 className="text-5xl font-bold text-slate-100 mb-6">
                Practice AKTU Previous Year Questions
            </h1>

            <p className="text-slate-400 text-lg mb-10">
                Prepare smarter by solving unit-wise PYQs from all subjects.
            </p>

            <button
                onClick={onStart}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition transform hover:scale-105"
            >
                Start Practicing
            </button>

            {/* animated scroll indicator */}

            <div className="mt-10 flex justify-center">

                <div className="animate-bounce text-slate-400 text-3xl">
                    ↓
                </div>

            </div>

        </div>

    )

}