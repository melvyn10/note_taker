// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var noteData = require("../db/db");
var fs = require("fs");
const { stringify } = require("querystring");
var filePath = "./db/db.json";

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

  function readFileAsync () {
    return new Promise (function (resolve, reject) {
      fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
          return reject(err);
        }
      });
    });
  }

  function writeFileAsync() {
    return new Promise(function(resolve, reject) {
      fs.writeFile(filePath, JSON.stringify(noteData, null, '\t'), function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async function writeDB() {
    await writeFileAsync().then(function() {
      console.log("write success");
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) {
    console.log("get /api/notes");
    res.json(noteData);
    console.log("note data");
    console.log(noteData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function(req, res) {
    // Note the code here. Our "server" will respond to requests and post the note
    // req.body is available since we're using the body parsing middleware
    console.log("post /api/notes");
    noteData.push(req.body);
    res.json(req.body);
    writeDB();
  });

  // API DELETE Requests
  app.delete("/api/notes/:id", function(req, res) {
    var i = req.params.id;
    console.log("delete /api/notes id=" + i );
    noteData.splice(req.params.id,1);
    writeDB();
    res.json(req.body);
  })
};
