import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Compilation() {
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
                🧳 Mon itinéraire
            </h1>



            <div className="
mt-10
bg-white
rounded-wander
shadow-card
p-10
">


                <p>
                    Vos attractions sélectionnées apparaîtront ici.
                </p>



                <button
                    className="
mt-6
bg-accent
text-white
px-8
py-3
rounded-xl
"
                >
                    Optimiser mon voyage
                </button>


            </div>


        </div>
    )
}