import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, createProfile, logout } from "../services/userService";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Chargement de la session au démarrage
    useEffect(() => {
        async function loadUser() {
            try {
                const response = await getProfile();
                if(response.data.detail === "Aucune session" || response.data.detail === "Profil introuvable"){
                    return;
                }
                setUser(response.data);
            }
            catch {
                setUser(null);
            }
            finally {
                setUserLoading(false);
            }
        }
        loadUser();
    }, []);

    // Création du profil + session
    const login = async (profileData) => {
        await createProfile(profileData);
        const response = await getProfile();
        setUser(response.data);
    };

    // Déconnexion
    const signOut = async () => {
        await logout();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, userLoading, login, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}