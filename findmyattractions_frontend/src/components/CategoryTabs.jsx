const CATEGORIES = [
    { value: "", label: "Tout" },
    { value: "attraction", label: "🗺️ Attractions" },
    { value: "restaurant", label: "🍽️ Restaurants" },
    { value: "hotel", label: "🏨 Hôtels" },
];

export default function CategoryTabs({ value, onChange }) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.value}
                    onClick={() => onChange(cat.value)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                      value === cat.value
                         ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-white text-gray-600 shadow-card hover:bg-gray-50"
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}