import { endpoints } from "./endpoints.js";
import { variables } from "./variables.js";

const { proxyUrl, options, countryInfoURL, url, leagueInfoURL, seasonInfoURL, roundInfoURL } = endpoints;

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

  //top five country ID gathering

  try {
    const response = await fetch(
      proxyUrl + encodeURIComponent(countryInfoURL),
      options,
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    let countryNameArray = result.categories;

    for (let countryName of countryNameArray) {
      let countryNameIterator = countryName.name.toLowerCase();

      if (
        topFiveCountryNamesHolder.includes(countryNameIterator)
      ) {
        topFiveCountriesID.push(countryName.id);
      }
    }



    //top five league ID gathering

    for (let countryID of topFiveCountriesID) {
      const response = await fetch(
        proxyUrl + encodeURIComponent(leagueInfoURL(countryID)),
        options,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      let leagueNameArray = result.groups[0].uniqueTournaments
      for (let leagueName of leagueNameArray) {
        let leagueNameIterator = leagueName.name.toLowerCase();

        if (
          topFiveCountryLeaguesHolder.includes(leagueNameIterator)
        ) {
          topFiveLeaguesID.push(leagueName.id);
        }
      }
    }

    //top five leagues current season gathering

    for (let leagueID of topFiveLeaguesID) {
      const response = await fetch(
        proxyUrl + encodeURIComponent(seasonInfoURL(leagueID)),
        options,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      topFiveLeaguesCurrentSeason.push({ leagueID: leagueID, currentSeasonID: result.seasons[0].id })
    }

    // setting zero percentage counter by counting how many of top five leagues, week 12 has started
    
    for (let topFiveCurrentSeason of topFiveLeaguesCurrentSeason) {
      const response = await fetch(
        proxyUrl + encodeURIComponent(roundInfoURL(topFiveCurrentSeason.leagueID, topFiveCurrentSeason.currentSeasonID)),
        options,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.currentRound.round >= 12 && result.currentRound.round < result.rounds.length) {
        zeroPercentageCounter++;
      }
    }

    //specifying the zero percentage (zero percentage= the percentage of 0-0 in leagues)

    if (zeroPercentageCounter > 0) {
      zeroPercentage = 86;
    }
    else {
      zeroPercentage = 81;
    }


  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

bet();

//fetching a website