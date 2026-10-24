// bet.js
import ExcelJS from 'https://esm.sh/exceljs@4.4.0';
import { endpoints } from "./endpoints.js";
import { variables } from "./variables.js";


const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('New Sheet');

worksheet.columns = [
 { header: 'country', key: 'country' },
 { header: 'countryId', key: 'countryId' }
];


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
worksheet.addRow({country:countryNameIterator, countryId:countryName.id})
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

    const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer], {
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
});
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'bet.xlsx';
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);

console.log('Downloaded bet.xlsx');
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

bet();


// ---- Download the .xlsx ----
