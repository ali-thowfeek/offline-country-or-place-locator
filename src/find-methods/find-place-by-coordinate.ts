import { PlaceFeature, GeoJson } from "../types";
import { validateCoordinate } from "../validation/coordinate-validation";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { polygon, multiPolygon, Point, Feature } from "@turf/helpers";
import { PLACE_NOT_FOUND } from "../common/constants/error-messages";

/**
 * Determines if a given point is in a territory or not
 */
const isPointWithinPlace = (
  place: PlaceFeature,
  point: Feature<Point>
): boolean => {
  const { type, coordinates } = place.geometry;
  if (type === "Polygon") {
    return booleanPointInPolygon(point, polygon(coordinates));
  } else if (type === "MultiPolygon") {
    return booleanPointInPolygon(point, multiPolygon(coordinates));
  }
  return false;
};

/**
 * Finds country or place and its details from given coordinate
 * @param geoJsonDataSet - the geojson formatted data set to find against
 * @param point - an array of two numbers - [x, y].
 * PAY ATTENTION: x == longitude, y == latitude!
 * @return {PlaceFeature} - details of the found item
 * @throws {Error} if not found
 */
export function findPlaceByCoordinate(
  geoJsonDataSet: GeoJson,
  point: number[]
): PlaceFeature;
/**
 * Finds country or place and its details from given coordinate
 * @param geoJsonDataSet - the geojson formatted data set to find against
 * @param latitude - latitude of coordinate
 * @param longitude - longitude of coordinate
 * @return {PlaceFeature} - details of the found item
 * @throws {Error} if not found
 */
export function findPlaceByCoordinate(
  geoJsonDataSet: GeoJson,
  latitude: number,
  longitude: number
): PlaceFeature;

export function findPlaceByCoordinate(
  geoJsonDataSet: GeoJson,
  pointOrLat: number[] | number,
  longitude?: number
): PlaceFeature {
  const coordinate = validateCoordinate(pointOrLat, longitude);
  const placeFound = geoJsonDataSet.features?.find((place: PlaceFeature) =>
    isPointWithinPlace(place, coordinate)
  );

  if (!placeFound) throw new Error(PLACE_NOT_FOUND);

  return placeFound;
}
