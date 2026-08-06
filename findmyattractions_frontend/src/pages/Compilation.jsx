import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getCompilation, removeCompilationItem } from "../services/compilationService";

const SORT_OPTIONS = [
    { value: "added", label: "Ordre d'ajout" },
    { value: "budget_asc", label: "Budget ↑" },
    { value: "budget_desc", label: "Budget ↓" },
    { value: "distance", label: "Itinéraire optimisé" },
];

export default function Compilation() {
    const { user, userLoading } = useUser();

    const [data, setData] = useState(null);
    const [sort, setSort] = useState("added");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingIds, setPendingIds] = useState(new Set());

    function load() {
        setLoading(true);
        setError(null);
        getCompilation(sort)
            .then(setData)
            .catch((err) => {
                console.error(err);
                setError("Impossible de charger la compilation.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (user) load();
    }, [sort, user]);

    function markPending(id, isPending) {
        setPendingIds((prev) => {
            const next = new Set(prev);
            if (isPending) next.add(id);
            else next.delete(id);
            return next;
        });
    }

    async function handleRemove(itemId) {
        markPending(itemId, true);
        try {
            await removeCompilationItem(itemId);
            load();
        } catch (err) {
            console.error(err);
            markPending(itemId, false);
        }
    }

    if (userLoading) return <p className="pt-32 px-10">Chargement...</p>;
    if (!user) return <Navigate to="/" replace />;

    const isRoute = sort === "distance";
    const items = data?.items || [];

    return (
        <div className="pt-32 px-10 pb-20 max-w-4xl mx-auto">
            <div className="mb-8">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-2">
                    Mon voyage
                </p>
                <h1 className="text-5xl font-display font-bold">Ma compilation</h1>
                {items.length > 0 && (
                    <p className="text-gray-500 mt-2">
                        {items.length} attraction{items.length > 1 ? "s" : ""} à parcourir
                    </p>
                )}
            </div>

            {loading && <p className="text-gray-500">Chargement...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && items.length === 0 && (
                <div className="bg-white rounded-wander shadow-card p-16 text-center">
                    <div className="text-5xl mb-4">🧭</div>
                    <h2 className="text-2xl font-display font-bold mb-2">
                        Ta liste est encore vide
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Ajoute des attractions depuis la recherche pour construire ton itinéraire.
                    </p>
                    <Link
                        to="/search"
                        className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-semibold"
                    >
                        Explorer les attractions
                    </Link>
                </div>
            )}

            {!loading && !error && items.length > 0 && (
                <>
                    {/* Récap façon souche de billet */}
                    <div className="bg-white rounded-wander shadow-card mb-8 flex overflow-hidden">
                        <div className="flex-1 p-6">
                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Budget total</p>
                            <p className="text-3xl font-display font-bold">
                                {"$".repeat(Math.max(data.total_budget, 1))}
                                {data.total_budget === 0 && <span className="text-gray-300">—</span>}
                            </p>
                        </div>
                        <div
                            className="w-0 border-l-2 border-dashed border-gray-200"
                            aria-hidden="true"
                        />
                        <div className="flex-1 p-6">
                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Distance totale</p>
                            <p className="text-3xl font-display font-bold">
                                {data.total_distance_km !== null ? `${data.total_distance_km} km` : "—"}
                            </p>
                            {data.total_distance_km === null && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Trie par "Itinéraire optimisé" pour calculer
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tri en pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setSort(opt.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    sort === opt.value
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : "bg-white text-gray-600 shadow-card hover:bg-gray-50"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Liste, avec jalons numérotés + ligne pointillée si tri par distance */}
                    <div className="relative">
                        {isRoute && items.length > 1 && (
                            <div
                                className="absolute left-5 top-8 bottom-8 w-0 border-l-2 border-dashed border-accent/40"
                                aria-hidden="true"
                            />
                        )}

                        <div className="space-y-4">
                            {items.map(({ item_id, attraction }, index) => {
                                const isPending = pendingIds.has(item_id);
                                return (
                                    <div
                                        key={item_id}
                                        className="relative flex items-center gap-4 group"
                                        style={{ opacity: isPending ? 0.4 : 1, transition: "opacity 0.15s" }}
                                    >
                                        {isRoute ? (
                                            <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold text-sm">
                                                {index + 1}
                                            </div>
                                        ) : (
                                            <div className="shrink-0 w-2 h-2 rounded-full bg-gray-300 ml-4" />
                                        )}

                                        <div className="flex-1 bg-white rounded-wander shadow-card p-5 flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold font-display">{attraction.name}</div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {attraction.price_level > 0
                                                        ? "$".repeat(attraction.price_level)
                                                        : "Prix non renseigné"}
                                                    {attraction.latitude === null && (
                                                        <span className="ml-2 text-amber-500">
                                                            · position inconnue
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item_id)}
                                                disabled={isPending}
                                                aria-label={`Retirer ${attraction.name} de la compilation`}
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button className="mt-10 w-full bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg">
                        Optimiser mon voyage
                    </button>
                </>
            )}
        </div>
    );
}