const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

//Ping elastic search
client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.log("Elasticsearch cluster is down!");
    } else {
      console.log("Everything is ok");
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

// client.index(
//   {
//     index: "search-app",
//     id: 1,
//     type: "cities",
//     body: {
//       body1: "Hi"
//     }
//   },
//   function(err, resp) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(resp);
//   }
// );

const cities = require("./cities.json");

bulk = [];

cities.forEach(city => {
  bulk.push({ index: { _index: "search-app", _type: "cities" } });
  bulk.push(city);
});
client.bulk({ body: bulk }, function(err, res) {
  if (err) {
    console.log("Failed bulk operation", err);
  } else {
    console.log(`successfully imported ${cities.length} cities`);
  }
});
