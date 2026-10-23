/*// test.js
const CORS_KEY = '89e1b07b';
const RAPIDAPI_KEY = '7bac5b958fmshac9e738698ed3d9p137c4djsn9653cb47ed5e';
const RAPIDAPI_HOST = 'sofascore.p.rapidapi.com';

const headers = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST
};

// Helper: fetch any RapidAPI URL through corsproxy.io
async function proxyFetch(targetUrl) {
  const params = new URLSearchParams({ key: CORS_KEY, url: targetUrl });
  const proxyUrl = 'https://corsproxy.io/?' + params;

  console.log('Fetching via:', proxyUrl);

  const response = await fetch(proxyUrl, { method: 'GET', headers });

  console.log('Status:', response.status, response.statusText);

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText} — ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

async function fetchTournamentsAndSeasons() {
  try {
    // ---- Step 1: country tournaments ----
    const tournamentsUrl = 'https://sofascore.p.rapidapi.com/tournaments/list?categoryId=1';
    const tournamentsData = await proxyFetch(tournamentsUrl);

    // SofaScore returns tournaments inside groups[0].uniqueTournaments
    const tournaments = tournamentsData?.groups?.[0]?.uniqueTournaments ?? [];
    console.log(`Found ${tournaments.length} tournaments`);

    // ---- Step 2: latest 2026/2027 season for each tournament ----
    const results = [];

    for (const tournament of tournaments) {
      const seasonsUrl = `https://sofascore.p.rapidapi.com/tournaments/get-seasons?tournamentId=${tournament.id}`;

      try {
        const seasonsData = await proxyFetch(seasonsUrl);

        // Find the 2026/2027 season
        const seasons = seasonsData?.seasons ?? [];
        const targetSeason = seasons.find(
          (s) => s.year === '2026/2027' || s.year === '26/27'
        );

        results.push({
          tournamentId: tournament.id,
          tournamentName: tournament.name,
          seasonId: targetSeason ? targetSeason.id : null,
          seasonYear: targetSeason ? targetSeason.year : null
        });

        console.log(
          `✓ ${tournament.name} (id=${tournament.id}) → season ${targetSeason?.year ?? 'NOT FOUND'} (id=${targetSeason?.id ?? 'n/a'})`
        );
      } catch (err) {
        console.error(`✗ ${tournament.name} (id=${tournament.id}) failed:`, err.message);
        results.push({
          tournamentId: tournament.id,
          tournamentName: tournament.name,
          seasonId: null,
          error: err.message
        });
      }
    }

    console.log('Final results:', results);
    return results;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

fetchTournamentsAndSeasons();*/


const countries=['Albania','Algeria','Argentina','Armenia','Australia','Austria','Azerbaijan','Bangladesh','Belarus','Belgium','Bolivia','Bosnia-Herzegovina','Brazil','Bulgaria','Canada','Chile','China','Colombia','Costa Rica','Croatia','Cyprus',
'Czech Republic','Denmark','Ecuador','Egypt','El Salvador','England','Estonia','Faroe Islands','Finland','France','Georgia'
,'Germany','Ghana','Greece','Guatemala','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel'
,'Italy','Japan','Kazakhstan','Kuwait','Latvia','Lithuania','Luxembourg','Macedonia','Malaysia','Mexico','Moldova','Montenegro'
,'Morocco','Netherlands','New Zealand','Nigeria','Northern Ireland','Norway','Panama','Paraguay','Peru','Poland','Portugal'
,'Qatar','Romania','Russia','Saudi Arabia','Scotland','Serbia','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain'
,'Sweden','Switzerland','Tanzania','Thailand','Tunisia','Türkiye','Ukraine','United Arab Emirates','United States','Uruguay',
'Uzbekistan','Venezuela',"Vietnam","Wales"]

console.log(countries.length);