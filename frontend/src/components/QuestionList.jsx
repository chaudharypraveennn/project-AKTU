export default function QuestionList({ questions, currentIndex, setCurrentIndex }) {

    return (
        <div className="p-4">

            <h2 className="font-semibold mb-4">
                Questions
            </h2>

            <div className="grid grid-cols-4 gap-2">

                {questions.map((q, index) => (

                    <button
                        key={q.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`p-2 rounded text-sm transition
              ${index === currentIndex
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-indigo-500 hover:text-white"
                        }`}
                    >
                        {index + 1}
                    </button>

                ))}

            </div>

        </div>
    )
}