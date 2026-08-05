import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/userService";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
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
                    <button onClick={handleLogout}
                        className="ml-4 px-5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition">
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    )
}