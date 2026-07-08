export const endpoints = {
  proxyUrl: 'https://corsproxy.io/?url=',
  options: {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ea21124a27msh2d1f5b78bf4331ep1d7a2cjsn13188233d52d',
      'x-rapidapi-host': 'sofascore.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  },
  countryInfoURL: 'https://sofascore.p.rapidapi.com/categories/list?sport=football',
  leagueInfoURL(countryID) {
    let leagueInfoReplacer = `https://sofascore.p.rapidapi.com/tournaments/list?categoryId=${countryID}`
    return leagueInfoReplacer;
  },
    seasonInfoURL(leagueID) {
    let seasonInfoReplacer = `https://sofascore.p.rapidapi.com/tournaments/get-seasons?tournamentId=${leagueID}`
    return seasonInfoReplacer;
  },
    roundInfoURL(leagueID, seasonID) {
    let roundInfoReplacer = `https://sofascore.p.rapidapi.com/tournaments/get-rounds?tournamentId=${leagueID}&seasonId=${seasonID}`
    return roundInfoReplacer;
  }  
}