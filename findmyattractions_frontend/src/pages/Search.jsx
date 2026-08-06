import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { searchAttractions } from "../services/searchService";
import SearchFilters from "../components/SearchFilters";
import CategoryTabs from "../components/CategoryTabs";
import AttractionCard from "../components/AttractionCard";

export default function Search() {
    const { user, userLoading } = useUser();

    const [filters, setFilters] = useState({
        category: "",
        city: "",
        radius: "",
        lat: "",
        lon: "",
        minReviews: "",
        minPhotos: "",
        priceLevel: "",
        profile: "",
    });
    const [results, setResults] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFilters((prev) => ({ ...prev, profile: user.profile_type || "" }));
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        setError(null);
        const timeout = setTimeout(() => {
            searchAttractions(filters)
                .then((data) => {
                    if (data.sections) {
                        setSections(data.sections);
                        setResults([]);
                    } else {
                        setResults(data.results || []);
                        setSections([]);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError("Impossible de charger les résultats.");
                })
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters, user]);

    function handleUseLocation() {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par ce navigateur.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFilters((prev) => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    radius: prev.radius || "5",
                }));
            },
            (err) => {
                console.error(err);
                alert("Impossible de récupérer ta position.");
            }
        );
    }

    if (userLoading) return <p className="pt-32 px-10">Chargement...</p>;
    if (!user) return <Navigate to="/" replace />;

    const isFlatView = !!filters.category;

    return (
        <div className="pt-32 px-10">
            <h1 className="text-5xl font-display font-bold mb-8">🔎 Recherche</h1>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                <SearchFilters filters={filters} onChange={setFilters} onUseLocation={handleUseLocation} />

                <div>
                    <CategoryTabs
                        value={filters.category}
                        onChange={(category) => setFilters((prev) => ({ ...prev, category }))}
                    />

                    {loading && <p>Chargement des résultats...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Vue groupée par catégorie */}
                    {!loading && !error && !isFlatView && sections.length === 0 && (
                        <p className="text-gray-500">Aucune attraction ne correspond à ces filtres.</p>
                    )}
                    {!loading && !error && !isFlatView && sections.map((section) => (
                        <section key={section.key} className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4">{section.label}</h2>
                            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4">
                                {section.attractions.map((attraction) => (
                                    <div key={attraction.id} className="snap-start shrink-0 w-72">
                                        <AttractionCard attraction={attraction} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Vue plate : une catégorie précise sélectionnée */}
                    {!loading && !error && isFlatView && results.length === 0 && (
                        <p className="text-gray-500">Aucune attraction ne correspond à ces filtres.</p>
                    )}
                    {!loading && !error && isFlatView && results.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((a) => (
                                <AttractionCard key={a.id} attraction={a} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}