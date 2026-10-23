const corsKey= "89e1b07b";

export const endpoints = { 
  options : {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '7bac5b958fmshac9e738698ed3d9p137c4djsn9653cb47ed5e',
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
  }, 
   buildProxyUrl (targetUrl) {
   return 'https://corsproxy.io/?' + new URLSearchParams({ key: corsKey, url: targetUrl });
}
}