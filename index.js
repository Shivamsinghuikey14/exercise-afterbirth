const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Function to read data from the JSON file
const getDataFromFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading ${fileName}: ${err.message}`);
  }
};

// Endpoint to fetch exercise data by day and time
app.get('/exercise/:day?/:time?', async (req, res) => {
  try {
    const { day, time } = req.params;
    const data = await getDataFromFile('./data.json');

    if (!day) {
      return res.json(data);
    }

    if (data[day]) {
      if (time) {
        if (data[day][time]) {
          return res.json(data[day][time]);
        } else {
          return res.status(404).send('Time data not found for the day');
        }
      }
      return res.json(data[day]);
    } else {
      return res.status(404).send('Day data not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('This is the exercise API data');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
