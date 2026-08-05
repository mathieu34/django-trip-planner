from django.core.management.base import BaseCommand
from django.core.management import call_command

VILLES = ["Paris", "Lyon", "Marseille", "Rome", "Barcelone", "Londres"]
CATEGORIES = ["attractions", "hotels", "restaurants"]


class Command(BaseCommand):
    help = "Importe plusieurs villes et catégories d'un coup via import_attractions."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=10, help="Nombre de lieux par ville/catégorie")

    def handle(self, *args, **options):
        limit = options["limit"]
        for ville in VILLES:
            for categorie in CATEGORIES:
                self.stdout.write(f"--- {categorie} à {ville} ---")
                call_command("import_attractions", query=ville, category=categorie, limit=limit)

        self.stdout.write(self.style.SUCCESS("Batch terminé."))
