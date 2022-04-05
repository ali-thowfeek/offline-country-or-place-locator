export interface PlaceFeature {
  type: string;
  geometry: {
    type:
      | "Point"
      | "MultiPoint"
      | "LineString"
      | "MultiLineString"
      | "Polygon"
      | "MultiPolygon"
      | "GeometryCollection";
    coordinates: any[];
  };
  properties: any;
}

export interface GeoJson {
  type: string;
  features: PlaceFeature[];
}
