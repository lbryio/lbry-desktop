import { countries as countryData } from 'country-data';

export const COUNTRIES = Array.from(
  new Set(
    countryData.all
      .filter((country) => country.status !== 'deleted')
      .map((country) => country.name)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (b > a) {
          return -1;
        }
        return 0;
      })
  )
);
