require('dotenv').config();

const express = require('express');

const app = express();
const host = '0.0.0.0';
const port = Number(process.env.PORT) || 8080;
const maxQueryLength = 200;

app.use(express.json({limit: '10kb'}));

app.get('/', (req, res) => {
  res.status(200).json({message: 'NoCalNutrition API'});
});

async function searchFoods(req, res) {
  const query = String(req.query.query ?? req.body?.query ?? '').trim();

  if (!query) {
    return res.status(400).json({error: 'A search query is required.'});
  }

  if (query.length > maxQueryLength) {
    return res.status(400).json({
      error: `Search queries must be ${maxQueryLength} characters or fewer.`,
    });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({error: 'Food search is not configured.'});
  }

  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
  url.search = new URLSearchParams({
    query,
    api_key: apiKey,
    pageSize: '8',
    dataType: 'Branded',
  }).toString();

  try {
    const upstreamResponse = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!upstreamResponse.ok) {
      return res.status(502).json({error: 'Food search provider request failed.'});
    }

    const data = await upstreamResponse.json();
    return res.status(200).json({
      foods: Array.isArray(data.foods) ? data.foods : [],
    });
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return res
      .status(timedOut ? 504 : 502)
      .json({
        error: timedOut
          ? 'Food search provider timed out.'
          : 'Unable to search for foods right now.',
      });
  }
}

app.get('/search', searchFoods);
app.post('/search', searchFoods);

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`Listening on http://${host}:${port}`);
  });
}

module.exports = app;
