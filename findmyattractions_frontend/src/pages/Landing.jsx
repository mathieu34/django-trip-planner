export default function Landing() {

    const profiles = [

        ["🏠", "Local"],

        ["🎒", "Touriste"],

        ["💼", "Professionnel"]

    ];

    return (
        <div className="
min-h-screen
bg-hero-gradient
flex
items-center
justify-center
px-6
">


            <div className="
text-center
max-w-5xl
">


                <h1 className="
font-display
text-7xl
font-bold
">
                    Explorez le monde
                </h1>


                <p className="
mt-6
text-xl
opacity-90
">
                    Votre compagnon intelligent pour créer
                    le voyage parfait.
                </p>



                <div className="
grid
md:grid-cols-3
gap-8
mt-14
">


                    {
                        profiles.map(([icon, name]) => (


                            <button
                                key={name}
                                className="
bg-white/20
backdrop-blur
rounded-wander
p-10
hover:bg-white/30
transition
"
                            >


                                <div className="text-5xl">
                                    {icon}
                                </div>


                                <p className="
mt-4
text-xl
font-bold
">
                                    {name}
                                </p>


                            </button>


                        ))
                    }


                </div>


            </div>


        </div>
    );
}