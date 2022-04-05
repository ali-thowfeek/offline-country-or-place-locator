# Offline Country or Place Locator

[![npm](https://img.shields.io/npm/v/offline-country-or-place-locator)](https://www.npmjs.com/package/offline-country-or-place-locator)
[![license](https://img.shields.io/npm/l/offline-country-or-place-locator)](LICENSE)

Fork of [country-locator](https://github.com/carmi2214/country-locator) by [carmi2214](https://github.com/carmi2214)

Detects country or place/city by a given geometry.

## Why

Main idea behind this fork is the freedom to have any custom data set as per your requirements. Hence this package doesn't include a data set unlike the original package which included a some 20MB data set of countries. This enables this package to be used in places like react native mobile app and more without the worry of adding extra space.

## Where to get the data set

This approach enables the data set to vary depedning on your requirments. For example You can download data sets from:

- `countries.geojson` from [geo-countries](https://github.com/datasets/geo-countries).
- `cities.geojson` from [geojson-world-cities](https://github.com/drei01/geojson-world-cities).

### Custom data set

Or you can create your own custom data set from tools like:

- [geojson.io](https://geojson.io/)

## Installation

```shell script
npm install offline-country-or-place-locator
```

## Usage

`findPlaceByCoordinate` accepts geoJson data set, latitude & longitude, or a point as an array,\
and returns the Feature object with the following fields:

- type: GeoJson type
- properties: this is where you'll find all the useful information about the country/city/place depending on the data set you input
- geometry: this is where you'll find the coordinates

```typescript
import {findPlaceByCoordinate} from "offline-country-or-place-locator";

try{
    const countryInfo = findPlaceByCoordinate(yourCountriesGeoJson, 51.500760, -0.125168);
    
    // assuming your data set has united kingdom and the properties
    // object has "ADMIN" key which stores the country name and
    // the "ISO_A3" key which stores the country code.
    // note these keys could change depending on your data set
    console.log(countryInfo.properties.ADMIN); // United Kingdom
    console.log(countryInfo.properties.ISO_A3); // GBR 
} catch (error){
    console.error(error);
}
```

You can also call it as a **point** - an array of `[x, y]`\
**PAY ATTENTION - `x == longitude` and `y == latitude`**

```typescript
try{
    const countryInfo = findPlaceByCoordinate(yourCountriesGeoJson, [-0.125168, 51.500760]);
    
    console.log(countryInfo.properties.ADMIN); // United Kingdom
    console.log(countryInfo.properties.ISO_A3); // GBR 
} catch (error){
    console.error(error);
}
```

---

`findPlacesByPolygon` accepts a polygon (array of points arrays)\
and returns an array of Feature Objects which contains the details of the countries/cities/places (depends on your dataset) that intersect with a given polygon

```typescript
import {findPlacesByPolygon} from "offline-country-or-place-locator";

try{
    const results = findPlacesByPolygon(yourGeoJson,[
        [-131.484375, 49.781264058178344],
        [-137.548828125, 44.15068115978094],
        [-128.935546875, 26.194876675795218],
        [-96.240234375, 22.755920681486405],
        [-72.50976562499999, 26.43122806450644],
        [-59.501953125, 42.48830197960227],
        [-62.314453125, 48.3416461723746],
        [-76.2890625, 50.3454604086048],
        [-109.77539062499999, 53.173119202640635],
        [-131.484375, 49.781264058178344]
    ]);
    console.log(results);
} catch (error){
    console.error(error);
}
```

## Test

```shell script
npm run test
```

## License

Offline Country or Place Locator is [MIT licensed](LICENSE).
