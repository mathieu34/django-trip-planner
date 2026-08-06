# Users App

Application Django responsable de la gestion des utilisateurs via une **session Django**. Il n'y a pas de système d'authentification classique.

Chaque utilisateur est identifié par une session.


## Responsabilités

- choix du profil utilisateur
- choix du pays (liste des pays du monde configurée dans `data/countries.py`)
- création de session
- récupération du profil courant
- suppression de session


### Déconnexion

Actions :

- suppression du profil
- suppression de la compilation
- destruction de la session

## Modèle

```python
UserProfile
```

| Champ | Description |
|--------|-------------|
| session_key | identifiant de session Django |
| profile_type | Local / Touriste / Professionnel |
| country | pays choisi |


## Fonctionnement

```
Landing
↓
Choix profil
↓
Choix pays
↓
Création session Django
↓
UserProfile
↓
Navigation Home
```

Toutes les autres requêtes utilisent la session Django grâce aux cookies.