const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

const express = require("express");

const app = express();

const bodyparser = require("body-parser");
const path = require("path");

//Ping elastic search
client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.log("Elasticsearch cluster is down!");
    } else {
      // console.log("Everything is ok");
    }
  }
);

// client.indices.create(
//   {
//     index: "search-app"
//   },
//   function(error, response, status) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("created a new index ", response);
//     }
//   }
// );

app.use(bodyparser.json());
app.set("port", process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, "public")));

//Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function(req, res) {
  res.sendFile("template.html", {
    root: path.join(__dirname, "views")
  });
});

app.get("/search", function(req, res) {
  let body = { size: 200, from: 0, query: { match: { name: req.query["q"] } } };
  client
    .search({ index: "search-app", body: body, type: "cities" })
    .then(results => {
      // console.log("results", results);
      res.send(results.hits.hits);
    })
    .catch(err => {
      console.log(err);
      res.send([]);
    });
});

app.listen(app.get("port"), function() {
  // console.log("Express server listening on port " + app.get("port"));
});

module.exports = app;
