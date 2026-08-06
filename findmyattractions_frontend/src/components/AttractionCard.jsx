import { useState } from "react";
import { Link } from "react-router-dom";
import { addToCompilation } from "../services/compilationService";

export default function AttractionCard({ attraction, onRemove, onAdded }) {
    const [added, setAdded] = useState(false);
    const [adding, setAdding] = useState(false);

    async function handleAdd(e) {
        e.preventDefault();
        setAdding(true);
        try {
            await addToCompilation(attraction.id);
            setAdded(true);
            onAdded?.();
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    }

    const priceDisplay = attraction.price_level ? attraction.price_level : "—";

    return (
        <div className="bg-white rounded-wander shadow-card p-5 flex flex-col justify-between">
            <Link to={`/attraction/${attraction.id}`}>
                <h3 className="font-display font-bold text-lg mb-1">{attraction.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                    {attraction.category__name} · {attraction.city || "Ville inconnue"}
                </p>
                <p className="text-sm mb-2">
                    ⭐ {attraction.note_tripadvisor} ({attraction.nombre_reviews} avis)
                </p>
                <p className="text-sm text-gray-400">{priceDisplay}</p>
            </Link>
            {onRemove ? (
                <button
                    onClick={(e) => { e.preventDefault(); onRemove(); }}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl">
                    ✕ Retirer
                </button>
            ) : (
                <button
                    onClick={handleAdd}
                    disabled={adding || added}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl disabled:opacity-50">
                    {added ? "✓ Ajouté" : adding ? "Ajout..." : "+ Compilation"}
                </button>
            )}
        </div>
    );
}