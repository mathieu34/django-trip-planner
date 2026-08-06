import { useState } from "react";
import { Link } from "react-router-dom";
import { addToCompilation } from "../services/compilationService";

export default function AttractionCard({ attraction, onRemove, onAdded }) {
    const [added, setAdded] = useState(false);
    const [adding, setAdding] = useState(false);

    async function handleAdd() {
        setAdding(true);
        try {
            await addToCompilation(attraction.id);
            setAdded(true);
            // `added` est un state local à cette carte : le parent (ex. la liste "Ma
            // compilation en cours") n'a aucun moyen de savoir qu'un ajout vient d'avoir
            // lieu sans ce callback, d'où onAdded pour lui permettre de se rafraîchir.
            onAdded?.();
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    }

    const priceDisplay = attraction.price_level ? attraction.price_level : "—";
    const photo = attraction.photos?.[0]?.url;

    return (
        <div className="bg-white rounded-wander shadow-card overflow-hidden flex flex-col justify-between">
            <Link to={`/attraction/${attraction.id}`}>
                {photo ? (
                    <img src={photo} alt={attraction.name} className="w-full h-40 object-cover" />
                ) : (
                    <div className="w-full h-40 bg-wanderlust-sand" />
                )}
                <div className="p-5">
                    <h3 className="font-display font-bold text-lg mb-1">{attraction.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {attraction.category__name} · {attraction.city || "Ville inconnue"}
                    </p>
                    <p className="text-sm mb-2">
                        ⭐ {attraction.note_tripadvisor} ({attraction.nombre_reviews} avis)
                    </p>
                    <p className="text-sm text-gray-400">{priceDisplay}</p>
                </div>
            </Link>
            <div className="px-5 pb-5">
                {onRemove ? (
                    <button
                        onClick={onRemove}
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
        </div>
    );
}