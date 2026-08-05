from rest_framework.views import APIView
from rest_framework.response import Response
from .mock_data_search import get_all_attractions
from .filters_search import apply_filters


class SearchView(APIView):
    def get(self, request):
        attractions = get_all_attractions()
        results = apply_filters(attractions, request.query_params)
        results = sorted(results, key=lambda a: a["likes"], reverse=True)
        return Response({"results": results, "count": len(results)})