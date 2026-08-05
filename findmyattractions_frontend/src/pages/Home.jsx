import { useEffect, useState } from "react";
import api from "../api/api";
import AttractionCard from "../components/AttractionCard";

export default function Home() {

    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useState + useEffect : le fetch doit partir seul au montage, cf. Attraction.jsx
    useEffect(() => {
        api.get('/attractions/')
            // res.data = le JSON renvoyé par Django ({"attractions": [...]}, cf. attraction_list dans views.py)
            .then((res) => setAttractions(res.data.attractions))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return (

        <main className="pt-32 px-10">

            <h1 className="text-5xl font-display font-bold">
                🌍 Destinations populaires
            </h1>

            {loading && <p className="mt-8">Chargement...</p>}
            {error && <p className="mt-8 text-gray-500">Impossible de charger les attractions.</p>}

            {!loading && !error && (
                // Carrousel : rangée scrollable horizontalement, cf. discussion overflow-x-auto/snap
                <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 mt-8">
                    {attractions.map((attraction) => (
                        <div key={attraction.id} className="snap-start shrink-0 w-72">
                            <AttractionCard attraction={attraction} />
                        </div>
                    ))}
                </div>
            )}

            {/*
                TODO - BLOQUÉ pour l'instant :
                Section "liste compilée qui se remplit au fur et à mesure" (cahier des charges, page Accueil).
                Dépend de l'app compilation, actuellement CASSÉE côté back : compilation/views.py importe
                compilation/mock_data.py qui n'existe pas (ModuleNotFoundError), et la route
                api/compilation/ n'est même pas incluse dans urls.py racine. À reprendre une fois
                que Personne 3 aura livré ce fichier + branché la route.
            */}

        </main>

    );
}
