require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
// const port = 3000;
const hostname = '0.0.0.0';
const app = express();
app.get('/', (req, res) => {
  console.log('hello');
  res.status(200).json({message: 'hello'});
});

app.get('/search', (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    let api_key = process.env.API_KEY;
    let food = req.body;
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${api_key}&pageSize=8&dataType=Branded`;
    res.send(url);
    // fetch(url)
    //   .then(resp => resp.json())
    //   .then(data => {
    //     console.log(JSON.stringify(data));
    // res.send(JSON.stringify(results))
    //   });
  } catch {
    res.send('Error');
  }
});
app.listen(port, hostname, () => {
  console.log(`Listening on http://${hostname}:${port}`);
});
