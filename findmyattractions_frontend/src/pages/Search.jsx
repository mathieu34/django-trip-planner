import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Search() {
    const { user, userLoading } = useUser();

    if (userLoading) {
        return <p>Chargement...</p>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="
pt-32
px-10
">


            <h1 className="
text-5xl
font-display
font-bold
">
                🔎 Recherche
            </h1>
        </div>
    )
}