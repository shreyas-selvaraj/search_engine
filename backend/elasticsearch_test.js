const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200']
 });

 client.ping({
    requestTimeout: 30000,
}, function(error) {
// at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

var body = {
  size: 1,
  from: 0,
  query: {
      "match_all": {}
      // match: {
      //     "content": "how to create post",
      // }
      
  },
  //"sort": { "_score": { "order": "desc" }}
}

client.search({index:'search_engine_test',  body:body, type:'urls'})
  .then(results => {
    console.log(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
  });