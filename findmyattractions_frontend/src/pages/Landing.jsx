import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";
import { getProfiles, getCountries } from "../services/userService";
import { getCsrfToken } from "../api/crsf";
import { useUser } from "../context/UserContext";

export default function Landing() {
    const { user, login, userLoading } = useUser();

    useEffect(() => {
        getCsrfToken();
    }, []);

    const navigate = useNavigate();
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [error, setError] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [countries, setCountries] = useState([]);

    const handleStart = async () => {
        setError("");
        if (!selectedProfile || !selectedCountry) {
            setError("Veuillez sélectionner un profil et un pays.");
            return;
        }

        try {
            await login({
                profile_type: selectedProfile,
                country: selectedCountry.value,
            });
            navigate("/home");
        }
        catch (err) {
            console.error(err);
            setError("Impossible de créer la session.");
        }
    };

    useEffect(() => {
        getProfiles().then((res) => {
            setProfiles(res.data);
        });
    }, []);

    useEffect(() => {
        getCountries()
            .then(response => {
                setCountries(response.data);
            });
    }, []);

    useEffect(() => {
        if (!userLoading && user) {
            navigate("/home");
        }
    }, [user, userLoading]);

    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Vérification de la session...
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-16">
            <div className="relative z-10 w-full max-w-6xl rounded-[32px] bg-white/60 backdrop-blur-xl shadow-2xl 
            border border-white/50 overflow-hidden"
            >
                <div className="text-center px-10 pt-12">
                    <h1 className="mt-6 text-5xl md:text-6xl font-display font-bold text-wanderlust-night">
                        Préparez votre prochaine aventure
                    </h1>
                    <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
                        Découvrez les meilleures attractions,
                        restaurants et hôtels grâce aux données
                        TripAdvisor et créez votre itinéraire idéal.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-14 px-12 py-14">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                                1
                            </div>
                            <h2 className="text-2xl font-semibold">
                                Choisissez votre profil
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {profiles.map((profile) => (
                                <button
                                    key={profile.value}
                                    onClick={() => setSelectedProfile(profile.value)}
                                    className={`group w-full flex items-center gap-6 rounded-2xl bg-white transition-all border
                                        ${selectedProfile === profile.value
                                            ? "border-primary ring-2 ring-primary/20 shadow-lg"
                                            : "border-slate-200 hover:border-primary"
                                        }`}
                                >
                                    <div className="w-16 h-16 rounded-full bg-wanderlust-sky/20 flex items-center justify-center
                                     text-3xl group-hover:scale-110 transition">
                                        {profile.icon}
                                    </div>

                                    <div className="text-left">
                                        <h3 className="text-xl font-semibold text-wanderlust-night">
                                            {profile.label}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                                2
                            </div>
                            <h2 className="text-2xl font-semibold">
                                Choisissez un pays
                            </h2>
                        </div>

                        <p className="text-slate-600 mb-8">
                            Les attractions affichées seront adaptées
                            au pays sélectionné.
                        </p>

                        <Select
                            options={countries}
                            value={selectedCountry}
                            onChange={setSelectedCountry}
                            placeholder="Sélectionner un pays..."
                            formatOptionLabel={(country) => (
                                <div className="flex items-center gap-3">
                                    <ReactCountryFlag
                                        countryCode={country.code}
                                        svg
                                        style={{
                                            width: "1.6em",
                                            height: "1.6em",
                                        }}
                                    />
                                    <span>{country.label}</span>
                                </div>
                            )}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: 58,
                                    borderRadius: 16,
                                    borderColor: "#e2e8f0",
                                    boxShadow: "none",
                                    paddingLeft: 8,
                                }),
                            }}
                        />

                        <div className="flex-1" />
                        <button
                            onClick={handleStart}
                            disabled={userLoading || !selectedProfile || !selectedCountry}
                            className={`mt-10 w-full py-4 rounded-2xl text-lg font-semibold shadow-xl transition-all 
                                ${userLoading || !selectedProfile || !selectedCountry
                                    ? "bg-slate-300 cursor-not-allowed"
                                    : "bg-primary hover:bg-primary-dark hover:-translate-y-1"
                                }`}
                        >
                            {userLoading ? "Création..." : "Commencer l'exploration →"}
                        </button>
                        {error && (
                            <p className="mt-4 text-red-600 text-sm text-center">
                                {error}
                            </p>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}