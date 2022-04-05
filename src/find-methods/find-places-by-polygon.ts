import { GeoJson, PlaceFeature } from "../types";
import intersect from "@turf/intersect";
import { polygon as createPolygon, Polygon, Feature } from "@turf/helpers";
import { validatePolygon } from "../validation/polygon-validation";

const placeIntersectsWithPolygon = (
  place: PlaceFeature,
  polygon: Feature<Polygon>
): boolean => {
  const { geometry } = place;

  if (geometry.type === "Polygon") {
    try {
      return intersect(createPolygon(geometry.coordinates), polygon) !== null;
    } catch {
      return false;
    }
  } else if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((coordinate: any) => {
      try {
        const placeTurfPolygon = createPolygon(coordinate);
        return intersect(placeTurfPolygon, polygon) !== null;
      } catch {
        return false;
      }
    });
  }
  return false;
};

/**
 * Finds countries or places/cities that intersect with a given polygon.
 * @param geoJsonDataSet - the geojson formatted data set to find against
 * @param polygon - a polygon of coordinates - has to be at least 4 points.
 * @return {PlaceFeature[]} - array of places as {PlaceFeature} objects
 * with the given polygon. empty array if the polygon doesn't intersect anything.
 */
export function findPlacesByPolygon(
  geoJsonDataSet: GeoJson,
  polygon: number[][]
): PlaceFeature[] {
  const validPolygon = validatePolygon(polygon);
  const placesInIntersection = geoJsonDataSet.features.filter((place) =>
    placeIntersectsWithPolygon(place, validPolygon)
  );
  return placesInIntersection;
}
