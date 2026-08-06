import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
    const { user, userLoading, signOut } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (error) {
            console.error("Erreur logout :", error);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur shadow-card">
            <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                <Link to="/" className="font-display font-bold text-3xl text-primary">
                    ✈️ FindMyAttractions
                </Link>
                {user && (
                    <div className="flex items-center gap-8 font-medium text-wanderlust-night">
                        <Link className="hover:text-primary transition" to="/home">
                            Explorer (Accueil)
                        </Link>
                        <Link className="hover:text-primary transition" to="/search">
                            Recherche
                        </Link>
                        <Link className="hover:text-primary transition" to="/compilation">
                            Mon voyage (compilation)
                        </Link>


                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-wanderlust-sky/20 border border-wanderlust-sky/40">
                                <span className="text-lg">👤</span>
                                <h2 className="text-sm font-semibold text-wanderlust-night">
                                    {user.profile_type}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-wanderlust-sand/30 border border-wanderlust-sand">
                                <span className="text-lg">🌍</span>
                                <p className="text-sm font-medium text-wanderlust-night">
                                    {user.country}
                                </p>
                            </div>

                            <button onClick={handleLogout}
                                className="ml-2 px-5 py-2 rounded-full border border-red-200 bg-white text-red-600 font-medium 
                            hover:bg-red-50 hover:border-red-300 transition-all"
                            >
                                Déconnexion
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </nav>
    )
}