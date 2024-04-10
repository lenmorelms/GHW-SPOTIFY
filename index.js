import fetch from 'node-fetch';
import express from 'express';
const app = express();

const clientId = '4e5406f22b95404a9c9700a169496208';
const clientSecret = '58d5ba0eaa2a4213a8a186dfabf31b18';
// const query = 'J Cole';
app.get(`/user/search`, (req, res) => {
  const query = req.query.query;
  // Get access token
  fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    // console.log(data.access_token);
      // Get artist data
    fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      // console.log(data);
      res.status(200).json(data);
    }).catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));