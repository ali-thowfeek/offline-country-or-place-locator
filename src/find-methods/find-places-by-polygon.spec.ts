import { findPlacesByPolygon } from "./find-places-by-polygon";
import { mocked } from "jest-mock";
import { validatePolygon } from "../validation/polygon-validation";
import { mockCitiesGeoJson, mockCountriesGeoJson } from "./mockData";

jest.mock("../validation/polygon-validation", () => ({
  validatePolygon: jest
    .fn()
    .mockImplementation(
      jest.requireActual("../validation/polygon-validation").validatePolygon
    ),
}));

const validatePolygonMock = mocked(validatePolygon);

describe("findPlacesByPolygon tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls validateCoordinate", () => {
    findPlacesByPolygon(mockCountriesGeoJson, [
      [1, 2],
      [3, 4],
      [5, 6],
      [1, 2],
    ]);
    expect(validatePolygonMock).toBeCalled();
  });

  test("validatePolygon throws error - throws error", () => {
    const errorMessage = "some error message";
    validatePolygonMock.mockImplementationOnce(() => {
      throw Error(errorMessage);
    });
    expect(() =>
      findPlacesByPolygon(mockCountriesGeoJson, [
        [1, 2],
        [3, 4],
        [5, 6],
        [1, 2],
      ])
    ).toThrow(new Error(errorMessage));
  });

  test("polygon inside Sri Lanka - returns Sri Lanka", () => {
    const polygon = [
      [80.00244140625, 7.73276506272982],
      [80.31005859375, 6.882800241767556],
      [81.40869140625, 7.427836528738338],
      [80.00244140625, 7.73276506272982],
    ];
    const countries = findPlacesByPolygon(mockCountriesGeoJson, polygon);
    expect(countries[0].properties.ADMIN).toStrictEqual("Sri Lanka");
  });

  test("polygon intersects Sri Lanka, Belgiuim - returns both country objects", () => {
    const polygon = [
      [-15.8203125, 44.59046718130883],
      [81.9140625, -7.710991655433217],
      [90.703125, 13.239945499286312],
      [11.6015625, 58.81374171570782],
      [-15.8203125, 44.59046718130883],
    ];
    const countries = findPlacesByPolygon(mockCountriesGeoJson, polygon);
    const countryNames = countries.map((country) => country.properties.ADMIN);
    expect(countryNames).toStrictEqual(["Sri Lanka", "Belgium"]);
  });

  test("polygon intersects MATALE, COLOMBO - returns both city objects", () => {
    const polygon = [
      [79.6343994140625, 6.9973114635733005],
      [79.79095458984375, 6.5200012268628385],
      [80.80169677734375, 7.12542165579628],
      [80.95550537109375, 7.520426889868663],
      [80.56549072265625, 7.6837733211111425],
      [79.6343994140625, 6.9973114635733005],
    ];
    const cities = findPlacesByPolygon(mockCitiesGeoJson, polygon);
    const cityNames = cities.map((city) => city.properties.NAME);
    expect(cityNames).toStrictEqual(["COLOMBO", "MATALE"]);
  });

  test("polygon in the pacific ocean - returns empty array", () => {
    const polygon = [
      [183.69140625, 38.41055825094609],
      [168.046875, 38.685509760012],
      [163.65234374999997, 28.613459424004414],
      [182.8125, 29.84064389983441],
      [183.69140625, 38.41055825094609],
    ];
    const countries = findPlacesByPolygon(mockCountriesGeoJson, polygon);
    expect(countries).toStrictEqual([]);
  });
});
