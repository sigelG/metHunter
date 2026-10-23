// bet.js

import { endpoints } from "./endpoints.js";
import { variables } from "./variables.js";

const {
  buildProxyUrl,
  options,
  countryInfoURL,
  leagueInfoURL,
  seasonInfoURL,
  roundInfoURL
} = endpoints;

let {
  topFiveCountryNamesHolder,
  topFiveCountryLeaguesHolder,
  topFiveCountriesID,
  topFiveLeaguesID,
  topFiveLeaguesCurrentSeason,
  zeroPercentageCounter,
  zeroPercentage
} = variables;


async function bet() {
  try {
    // ---- Top five country ID gathering ----
    const response = await fetch(buildProxyUrl(countryInfoURL), options);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const countryNameArray = result.categories;

    for (const countryName of countryNameArray) {
      const countryNameIterator = countryName.name.toLowerCase();

      if (topFiveCountryNamesHolder.includes(countryNameIterator)) {
        topFiveCountriesID.push(countryName.id);
      }
    }

    // ---- Top five league ID gathering ----
    for (const countryID of topFiveCountriesID) {
      const response = await fetch(
        buildProxyUrl(leagueInfoURL(countryID)),
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const leagueNameArray = result.groups[0].uniqueTournaments;

      for (const leagueName of leagueNameArray) {
        const leagueNameIterator = leagueName.name.toLowerCase();

        if (topFiveCountryLeaguesHolder.includes(leagueNameIterator)) {
          topFiveLeaguesID.push(leagueName.id);
        }
      }
    }

    // ---- Top five leagues current season gathering ----
    for (const leagueID of topFiveLeaguesID) {
      const response = await fetch(
        buildProxyUrl(seasonInfoURL(leagueID)),
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      topFiveLeaguesCurrentSeason.push({
        leagueID,
        currentSeasonID: result.seasons[0].id
      });
    }

    // ---- Zero percentage counter ----
    for (const topFiveCurrentSeason of topFiveLeaguesCurrentSeason) {
      const response = await fetch(
        buildProxyUrl(
          roundInfoURL(
            topFiveCurrentSeason.leagueID,
            topFiveCurrentSeason.currentSeasonID
          )
        ),
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (
        result.currentRound.round >= 12 &&
        result.currentRound.round < result.rounds.length
      ) {
        zeroPercentageCounter++;
      }
    }

    // ---- Zero percentage ----
    zeroPercentage = zeroPercentageCounter > 0 ? 86 : 81;

    console.log('zeroPercentage:', zeroPercentage);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

bet();