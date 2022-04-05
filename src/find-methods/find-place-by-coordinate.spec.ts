import { findPlaceByCoordinate } from "./find-place-by-coordinate";
import { validateCoordinate } from "../validation/coordinate-validation";
import { mocked } from "jest-mock";
import { mockCitiesGeoJson, mockCountriesGeoJson } from "./mockData";
import { PLACE_NOT_FOUND } from "../common/constants/error-messages";

jest.mock("../validation/coordinate-validation", () => ({
  validateCoordinate: jest
    .fn()
    .mockImplementation(
      jest.requireActual("../validation/coordinate-validation")
        .validateCoordinate
    ),
}));

const validateCoordinateMock = mocked(validateCoordinate);

describe("findPlaceByCoordinate tests", function () {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls validateCoordinate", () => {
    try {
      findPlaceByCoordinate(mockCitiesGeoJson, 0, 0);
    } catch (error) {}
    expect(validateCoordinateMock).toHaveBeenCalled();
  });

  test("validateCoordinate throws error - throws error", () => {
    const errorMessage = "some error message";
    validateCoordinateMock.mockImplementationOnce(() => {
      throw TypeError(errorMessage);
    });
    expect(() => findPlaceByCoordinate(mockCountriesGeoJson, 0, 0)).toThrow(
      new TypeError(errorMessage)
    );
  });

  describe("valid params were given", () => {
    test("a coordinate in Kandy should return Sri Lanka Object", () => {
      const countryInfo = findPlaceByCoordinate(
        mockCountriesGeoJson,
        7.292798,
        80.636966
      );
      expect(countryInfo.properties.ADMIN).toBe("Sri Lanka");
    });

    test("a coordinate in Brussels should return Belgium Object", () => {
      const countryInfo = findPlaceByCoordinate(
        mockCountriesGeoJson,
        50.874338,
        4.248688
      );
      expect(countryInfo.properties.ADMIN).toBe("Belgium");
    });

    test("a coordinate in COLOMBO should return COLOMBO city Object", () => {
      const cityInfo = findPlaceByCoordinate(
        mockCitiesGeoJson,
        6.913551377004948,
        79.86129449022698
      );
      expect(cityInfo.properties.NAME).toBe("COLOMBO");
    });

    test("a coordinate in MATALE should return MATALE city Object", () => {
      const cityInfo = findPlaceByCoordinate(
        mockCitiesGeoJson,
        7.466934,
        80.623263
      );
      expect(cityInfo.properties.NAME).toBe("MATALE");
    });
  });

  describe("no country in given coordinate", () => {
    test("throws error", () => {
      expect(() => findPlaceByCoordinate(mockCountriesGeoJson, 0, 0)).toThrow(
        new Error(PLACE_NOT_FOUND)
      );
    });
  });
});
