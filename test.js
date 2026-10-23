// test.js
const params = new URLSearchParams({
  key: '89e1b07b',
  url: 'https://sofascore.p.rapidapi.com/categories/list?sport=football'
});

const proxyUrl = 'https://corsproxy.io/?' + params;

async function fetchTeam() {
  console.log('Fetching via:', proxyUrl);

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '7bac5b958fmshac9e738698ed3d9p137c4djsn9653cb47ed5e',
        'x-rapidapi-host': 'sofascore.p.rapidapi.com'
      }
    });

    console.log('Status:', response.status, response.statusText);

    const text = await response.text();
    console.log('Raw body (first 500 chars):', text.slice(0, 500));

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = JSON.parse(text);
    console.log('Data:', result);
    return result;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

fetchTeam();