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
  let movies = []
  let websiteName = "ExpressMovies";
  
   fs.createReadStream("./movies.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      let movie = {
        'name': row[0],
        'genre': row[1],
        'year': row[7]
      };
      movies.push(movie);
    })
    .on('end', () => {
      res.render("home", { name: websiteName, movies: movies })
    });
});

app.listen(3000)