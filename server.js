const express = require("express");
const app = express();
const fs = require("fs");
const { parse } = require("csv-parse"); 
const cache = require("memory-cache");
const mysql = require("mysql");

app.set("view engine", "pug");
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-icons/font'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'node_project'
});

connection.connect();


app.get("/", async (req, res) => {
  let index = 1;
  let start = req.query.page ?? 1;
  start = parseInt(start);
  let activePage = start;
  let max = 10;
  let movies = [];
  let websiteName = "ExpressMovies";
  let numberOfRecords = getNumberOfRows("./movies.csv");
  let paginations = buildPagination(numberOfRecords, max);

  let cachedResults = getCachedData(start, (start + (max - 1)));
  movies = cachedResults.hits;

  if (cachedResults.misses.length === 0) {
    res.render("home", { name: websiteName, movies: movies, paginations: paginations, 'active': activePage });

    return;
  }

  let additionalMovies = fetchDataFromDatabase(start, (start + (max - 1)));
  movies.concat(additionalMovies);

  res.render("home", { name: websiteName, movies: movies, paginations: paginations, 'active': activePage });
});

function getNumberOfRows(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf8');

  const rows = csvContent.split('\n').length;

  return rows;
}

function buildPagination(numberOfRecords, maxRecords){
  let paginations = [];
  let page = 1;

  const numberOfPages = Math.ceil(numberOfRecords / maxRecords);
  
  for(let i = 1;i <= numberOfPages; i++){
    let pagination = {
      key: i,
      page: page
    };

    paginations.push(pagination);

    page += maxRecords;
  }

  return paginations;
}

function getCachedData (startingKey, endingKey) {
  let cacheMiss = [];
  let cacheHits = [];

  for (i = startingKey; i <= endingKey; i++) {
    const cachedData = cache.get(i);

    if (cachedData) {
      cacheHits.push(cachedData);
      console.log("Cache Hit.");

      continue;
    }

    cacheMiss.push(i);
    console.log("Cache Miss.");
  }

  return {
    hits: cacheHits,
    misses: cacheMiss
  };
}

function fetchDataFromDatabase (startingIndex, endingIndex) {
  let data = [];

  for (i = startingIndex; i <= endingIndex; i++) {

    connection.query(`SELECT name, genre, year FROM movies WHERE id = ?;`, [i], (err, rows, fields) => {
      if (err) throw err

      let movie = {
        'name': rows[0].name,
        'genre': rows[0].genre,
        'year': rows[0].year
      };

      cache.put(i, movie);
      data.push(movie);
    });
  }

  console.log("Fetched from Database.", data);

  return data;
}

function fetchDataFromCSV (index, start, max) {
  let readStream = fs.createReadStream("./movies.csv");
  readStream
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    
    if (index === (start + max)) {
      readStream.unpipe(parse({ delimiter: ",", from_line: 2 }));
      return false;
    }

    if (index >= start) {
      let movie = {
        'name': row[0],
        'genre': row[1],
        'year': row[7]
      };
      
      movies.push(movie);
      cache.put(index, movie);
    }

    index++;

  })
  .on('end', () => {
    res.render("home", { name: websiteName, movies: movies, paginations: paginations, 'active': activePage });
  });
}

app.listen(3000)