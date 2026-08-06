import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AttractionCard from "../components/AttractionCard";

export default function Attraction() {
    const { user, userLoading } = useUser();
    const { id } = useParams()
    const [attraction, setAttraction] = useState(null)
    const [similarAttractions, setSimilarAttractions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // useState seul = état déclenché par l'utilisateur (clic, saisie)
    // useState + useEffect = état déclenché par l'extérieur (chargement de page, API, timer...)
    // ici : le fetch doit partir seul au montage -> useEffect nécessaire
    useEffect(() => {
        setLoading(true)
        api.get(`/attractions/${id}/`)
            .then((res) => {
                setAttraction(res.data.attraction)
                setSimilarAttractions(res.data.similar_attractions)
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }, [id]);

    if (loading || userLoading) return <p className="pt-24 text-center">Chargement...</p>;
    if (error || !attraction) return <p className="pt-24 text-center">Attraction introuvable.</p>;

  const horaires = Array.isArray(attraction.horaires)
    ? attraction.horaires
    : null;


    const groupes = Array.isArray(attraction.groupes) ? attraction.groupes : [];

    const recompenses = Array.isArray(attraction.recompenses) ? attraction.recompenses : [];

    // Choix des balises : sémantique d'abord, style ensuite (Tailwind fait le style)
    // h1 = titre unique de la page | h2 = titre de sous-section
    // p = paragraphe (bloc) | span = texte inline (badges, ne casse pas la ligne)
    // ul/li = vraie liste énumérable (via .map) | div = conteneur sans sens, juste layout
    // a = uniquement pour un vrai lien (URL)

    // Logique JSX utilisée plus bas :
    // 1. {condition && <jsx>}   -> affiche <jsx> seulement si condition est vraie (champ optionnel)
    // 2. {valeur}               -> affiche une variable JS (obligatoire, sinon c'est du texte brut)
    // 3. tableau.map(...)       -> transforme une liste en JSX, avec une "key" unique par élément
    // 4. a?.b                   -> lit a.b sans planter si "a" est null/undefined
    // 5. a ?? b                 -> utilise "a", sinon "b" si "a" est null/undefined
    // 6. variables calculées avant le return -> garde le JSX simple à lire

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="pt-24">

            <section className="max-w-5xl mx-auto p-10">

                <div className="flex flex-wrap items-center gap-3">
                    {attraction.category && (
                        <span className="px-3 py-1 rounded-wander bg-wanderlust-sand text-sm font-medium">
                            {attraction.category.name}
                        </span>
                    )}
                    {attraction.price_level && (
                        <span className="px-3 py-1 rounded-wander bg-wanderlust-sand text-sm font-medium">
                            {attraction.price_level}
                        </span>
                    )}
                </div>

                <h1 className="text-6xl font-display font-bold mt-4">
                    {attraction.name}
                </h1>

                <div className="flex items-center gap-2 mt-3 text-lg">
                    <span className="font-bold text-accent">⭐ {attraction.note_tripadvisor}</span>
                    <span className="text-gray-500">({attraction.nombre_reviews} avis)</span>
                </div>

                {attraction.description && (
                    <p className="mt-6 text-lg leading-relaxed">{attraction.description}</p>
                )}

                <div className="grid md:grid-cols-3 gap-5 mt-10">

                    <div className="p-6 rounded-wander shadow-card">
                        <h2 className="font-display font-bold text-xl mb-3">Contact</h2>
                        {attraction.phone && <p>📞 {attraction.phone}</p>}
                        {attraction.email && <p>✉️ {attraction.email}</p>}
                        {attraction.website && (
                            <a
                                href={attraction.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline"
                            >
                                🌐 Site web
                            </a>
                        )}
                        {!attraction.phone && !attraction.email && !attraction.website && (
                            <p className="text-gray-500">Non disponible</p>
                        )}
                    </div>

                    <div className="p-6 rounded-wander shadow-card">
                        <h2 className="font-display font-bold text-xl mb-3">Localisation</h2>
                        {attraction.address && <p>{attraction.address}</p>}
                        <p>{[attraction.city, attraction.country].filter(Boolean).join(", ")}</p>
                    </div>
                  
                <div className="p-6 rounded-wander shadow-card">
                    <h2 className="font-display font-bold text-xl mb-3">Horaires</h2>

              {horaires && horaires.length > 0 ? (
                  <ul className="space-y-1">
                      {horaires.map((line, i) => (
                     <li key={i}>
                        {line.day_of_week} : {line.opens} - {line.closes}
                        </li>
                       ))}
                      </ul>
                     ) : (
                    <p className="text-gray-500">Non disponibles</p>
                      )}
              </div>

                </div>

                {attraction.category?.group === "attraction" && groupes.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-display font-bold text-xl mb-3">Groupes</h2>
                        <div className="flex flex-wrap gap-2">
                            {groupes.map((groupe, i) => (
                                <span key={i} className="px-3 py-1 rounded-wander bg-wanderlust-sand text-sm">
                                    {groupe.name ?? groupe}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {attraction.photos?.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-display font-bold text-xl mb-3">Photos</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {attraction.photos.map((photo) => (
                                <img
                                    key={photo.id}
                                    src={photo.url}
                                    alt={attraction.name}
                                    className="w-full h-32 object-cover rounded-wander shadow-card"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {recompenses.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-display font-bold text-xl mb-3">Récompenses</h2>
                        <ul className="space-y-1">
                            {recompenses.map((award, i) => (
                                <li key={i}>🏆 {award.display_name ?? award.name ?? award}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {similarAttractions.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-display font-bold text-xl mb-3">Suggestions similaires</h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            {similarAttractions.map((item) => (
                                <AttractionCard attraction={item} key={item.id} />
                            ))}
                        </div>
                    </div>
                )}

            </section>

        </div>

    )

}