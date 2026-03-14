export default function QuestionViewer({ question, currentIndex, total, setCurrentIndex }) {

    const progress = ((currentIndex + 1) / total) * 100

    return (
        <div className="animate-fadeIn">

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">

                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />

            </div>

            {/* Question Title */}
            <h1 className="text-2xl font-bold mb-6">
                Question {currentIndex + 1}
            </h1>

            {/* Question Text */}
            <p className="text-gray-700 leading-relaxed">
                {question.text}
            </p>

            {/* Navigation */}
            <div className="mt-10 flex gap-4">

                <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                    Previous
                </button>

                <button
                    disabled={currentIndex === total - 1}
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    Next
                </button>

            </div>

        </div>
    )
}