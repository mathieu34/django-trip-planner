import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import AttractionCard from "../components/AttractionCard";
import { getCompilation, removeCompilationItem } from "../services/compilationService";

export default function Home() {

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [compilationItems, setCompilationItems] = useState([]);

    // useState + useEffect : le fetch doit partir seul au montage, cf. Attraction.jsx
    useEffect(() => {
        api.get('/attractions/')
            // res.data = le JSON renvoyé par Django ({"sections": [{key, label, attractions}, ...]}, cf. attraction_list dans views.py)
            .then((res) => setSections(res.data.sections || []))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);

    function refreshCompilation() {
        getCompilation()
            .then((data) => setCompilationItems(data.items || []));
    }

    useEffect(() => {
        refreshCompilation();
    }, []);

    function handleRemoveFromCompilation(itemId) {
        removeCompilationItem(itemId)
            .then(() => setCompilationItems((prev) => prev.filter((item) => item.item_id !== itemId)))
            .catch((err) => console.error(err));
    }

    return (

        <main className="pt-32 px-10 pb-20">

            <h1 className="text-5xl font-display font-bold">
                🌍 Destinations populaires
            </h1>

            {loading && <p className="mt-8">Chargement...</p>}
            {error && <p className="mt-8 text-gray-500">Impossible de charger les attractions.</p>}

            {!loading && !error && sections.map((section) => (
                <section key={section.key} className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">{section.label}</h2>

                    {/* Carrousel : rangée scrollable horizontalement, cf. discussion overflow-x-auto/snap */}
                    <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4">
                        {section.attractions.map((attraction) => (
                            <div key={attraction.id} className="snap-start shrink-0 w-72">
                                <AttractionCard attraction={attraction} onAdded={refreshCompilation} />
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {compilationItems.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-display font-bold text-xl mb-3">Ma compilation en cours</h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {compilationItems.map(({ item_id, attraction }) => (
                            <AttractionCard
                                attraction={attraction}
                                onRemove={() => handleRemoveFromCompilation(item_id)}
                                key={item_id}
                            />
                        ))}
                    </div>
                    <Link to="/compilation" className="inline-block mt-6 text-primary font-semibold hover:underline">
                        Voir ma compilation →
                    </Link>
                </div>
            )}

        </main>

    );
}
