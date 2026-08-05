import { Link } from "react-router-dom";

// Pourquoi un fichier à part de Attraction.jsx (la page) :
// - Réutilisée à 3 endroits (carrousel Accueil, suggestions Page attraction, liste Compilation)
//   -> un seul fichier à modifier si le design de la carte change, pas 3.
// - Attraction.jsx = une PAGE (une route, fetch ses propres données, layout plein écran).
//   AttractionCard.jsx = un COMPOSANT (juste un bout d'UI réutilisable, sans route ni fetch).
// - Séparation des responsabilités : la page décide QUOI afficher (quelles attractions),
//   la carte décide juste COMMENT afficher UNE attraction.

// Carte 100% présentationnelle : pas de useState/useEffect ici,
// les données arrivent déjà prêtes via les props (fetchées par le parent).
export default function AttractionCard({ attraction, onRemove }) {

    const photo = attraction.photos?.[0]?.url;

    return (
        <Link
            to={`/attraction/${attraction.id}`}
            className="relative block rounded-wander shadow-card overflow-hidden hover:shadow-travel transition"
        >

            {photo ? (
                <img
                    src={photo}
                    alt={attraction.name}
                    className="w-full h-40 object-cover"
                />
            ) : (
                <div className="w-full h-40 bg-wanderlust-sand" />
            )}

            <div className="p-4">

                <h3 className="font-display font-bold text-lg truncate">
                    {attraction.name}
                </h3>

                <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-accent font-bold">
                        ⭐ {attraction.note_tripadvisor}
                    </span>
                    <span className="text-gray-500">
                        ({attraction.nombre_reviews} avis)
                    </span>
                </div>

                {attraction.price_level && (
                    <span className="px-2 py-0.5 rounded-wander bg-wanderlust-sand text-xs">
                        {attraction.price_level}
                    </span>
                )}

            </div>

            {onRemove && (
                // Le bouton est imbriqué dans le <Link> :
                // - preventDefault() : annule la navigation que le Link ferait sinon
                // - stopPropagation() : empêche le clic de remonter jusqu'au Link parent
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(attraction.id); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow-card flex items-center justify-center"
                >
                    ✕
                </button>
            )}

        </Link>
    );
}
