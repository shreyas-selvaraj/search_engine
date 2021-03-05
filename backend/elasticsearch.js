const elasticsearch = require('elasticsearch');

  const createClient = () => {
    const client = new elasticsearch.Client({
        hosts: [ 'http://localhost:9200']
     });
     // ping the client to be sure Elasticsearch is up
     client.ping({
          requestTimeout: 30000,
      }, function(error) {
      // at this point, eastic search is down, please check your Elasticsearch service
          if (error) {
              console.error('Elasticsearch cluster is down!');
          } else {
              console.log('Everything is ok');
          }
      });

    client.indices.create({
        index: 'search_engine_test'
    }, function(error, response, status) {
        if (error) {
            console.log(error);
        } else {
            console.log("created a new index", response);
        }
    });
    return client;
  }

module.exports = {createClient}

//     client.index({
//         index: 'search_engine_test',
//         id: '1',
//         type: 'urls',
//         body: {
//             "key1": "test"
//         }
//     }, function(err, resp, status) {
//         console.log(resp);
//     });
// }

// createClient();