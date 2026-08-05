import Select from "react-select";
import ReactCountryFlag from "react-country-flag";

export default function Landing() {
    const profiles = [
        ["🏠", "Local"],
        ["🎒", "Touriste"],
        ["💼", "Professionnel"],
    ];

    const countries = [
        { value: "France", label: "France", code: "FR" },
        { value: "Italy", label: "Italie", code: "IT" },
        { value: "Spain", label: "Espagne", code: "ES" },
        { value: "Germany", label: "Allemagne", code: "DE" },
        { value: "Japan", label: "Japon", code: "JP" },
        { value: "United States", label: "États-Unis", code: "US" },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-16">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-black/20" />
            <div
                className="
                    relative
                    z-10
                    w-full
                    max-w-6xl
                    rounded-[32px]
                    bg-white/90
                    backdrop-blur-xl
                    shadow-2xl
                    border
                    border-white/50
                    overflow-hidden
                "
            >

                <div className="text-center px-10 pt-12">
                    <h1 className="
                        mt-6
                        text-5xl
                        md:text-6xl
                        font-display
                        font-bold
                        text-wanderlust-night
                    ">
                        Préparez votre prochaine aventure
                    </h1>

                    <p className="
                        mt-5
                        max-w-2xl
                        mx-auto
                        text-lg
                        leading-relaxed
                        text-slate-600
                    ">
                        Découvrez les meilleures attractions,
                        restaurants et hôtels grâce aux données
                        TripAdvisor et créez votre itinéraire idéal.
                    </p>

                </div>

                <div className="grid lg:grid-cols-2 gap-14 px-12 py-14">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="
                                w-10 h-10
                                rounded-full
                                bg-primary
                                flex items-center justify-center
                                font-bold
                            ">
                                1
                            </div>

                            <h2 className="text-2xl font-semibold">
                                Choisissez votre profil
                            </h2>

                        </div>

                        <div className="space-y-3">
                            {profiles.map(([icon, name]) => (
                                <button
                                    key={name}
                                    className="
                                        group
                                        w-full
                                        flex
                                        items-center
                                        gap-6
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        hover:border-primary
                                        hover:shadow-lg
                                        transition-all
                                    "
                                >
                                    <div className="
                                        w-16
                                        h-16
                                        rounded-full
                                        bg-wanderlust-sky/20
                                        flex
                                        items-center
                                        justify-center
                                        text-3xl
                                        group-hover:scale-110
                                        transition
                                    ">
                                        {icon}
                                    </div>

                                    <div className="text-left">
                                        <h3 className="
                                            text-xl
                                            font-semibold
                                            text-wanderlust-night
                                        ">
                                            {name}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="
                                w-10
                                h-10
                                rounded-full
                                bg-primary
                                flex
                                items-center
                                justify-center
                                font-bold
                            ">
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
                            className="
                                mt-10
                                w-full
                                py-4
                                rounded-2xl
                                bg-primary
                                text-lg
                                font-semibold
                                shadow-xl
                                hover:bg-primary-dark
                                hover:-translate-y-1
                                transition-all
                            "
                        >
                            Commencer l'exploration →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}