const express = require("express")
const app = express()
const fs = require("fs")
const { parse } = require("csv-parse") 

app.set("view engine", "pug");
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-icons/font'));

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

  
  let readStream = fs.createReadStream("./movies.csv");
  readStream
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    
    if(index === (start + max)){
      readStream.unpipe(parse({ delimiter: ",", from_line: 2 }));
      return false;
    }

    if(index >= start){
      let movie = {
        'name': row[0],
        'genre': row[1],
        'year': row[7]
      };
  
      movies.push(movie);
    }

    index++;

  })
  .on('end', () => {
    res.render("home", { name: websiteName, movies: movies, paginations: paginations, 'active': activePage });
  });
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

app.listen(3000)