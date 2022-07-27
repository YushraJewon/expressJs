# ExpressJs exercise
This exercise is about express JS which is a web application framwork for node.js.

## Project setup [already done for this template]
### Creating package.json
- npm init -y
This creates a basic package.json containing the dependencies and devDependencies.

### Installing express js
- npm install express --save

## Template structure
- View: home.pug in the views folder which appear at root url localhost:3000/
- Controller: server.js has functions to get the requested data, create an HTML page displaying the data, and return it to the user to view in the browse
- movies.csv: a csv file that contain the following movie details: Film, Genre, Lead Studio, Audience score, Profitability, Rotten Tomatoes, Worldwide Gross, Year

## Installation
- Clone this repo
- `npm i`

## Live reload
Nodemon has been used to detect changes in files and restart the application automatically without having to restart the server again.

## Start server
- `npm run devStart`
- `rs` : to restart server

## Load the application
Load http://localhost:3000/ to see the output

## Future work instructions
- [ ] Display content of movies.csv into a table on home.pug.
- [ ] Use a library like bootstrap to style the table.
- [ ] The table should include pagination and display only 25 records per page.
- [ ] Moving to the next page should fetch the next 25 records from the file. So a request should fetch a maximum 25 records.
- [ ] Moving to the previous page should not make another request from the server instead get the record from the local browser storage. 
- [ ] Modify/Update a line in the table should send a request to the server to update the line.
You may either update the original csv file or write a new file with the updated line.
