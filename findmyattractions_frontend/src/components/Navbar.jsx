import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="
           fixed
top-0
w-full
z-50
bg-white/80
backdrop-blur
shadow-card
        ">

            <div className="
                max-w-7xl
mx-auto
px-8
py-4
flex
justify-between
items-center
            ">

                <Link
                    to="/"
                    className="
                    font-display
font-bold
text-3xl
text-primary
                    "
                >
                    ✈️ FindMyAttractions
                </Link>


                <div className="flex
gap-8
font-medium">

                    <Link className="hover:text-accent" to="/home">
                        Explorer (Accueil)
                    </Link>

                    <Link className="hover:text-accent" to="/search">
                        Recherche
                    </Link>

                    <Link className="hover:text-accent" to="/compilation">
                        Mon voyage (compilation)
                    </Link>

                </div>

            </div>

        </nav>
    )
}