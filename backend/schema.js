const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLNumber, GraphQLObject } = graphql;

const elasticsearch = require('elasticsearch');
const { version } = require('cheerio');

const client = new elasticsearch.Client({
    node: 'https://localhost:9200',
 });

var body = {
    size: 200,
    from: 0,
    query: {
        //"match_all": {}
        match: {
            "content": "how to create post",
        }
  }
}

const PageType = new GraphQLObjectType({
    name: 'Page', //name of type
    fields: () => ({ //has these fields
        url: {type: GraphQLString},
        content: {type: new GraphQLList(GraphQLString)},
        keywords: {type: new GraphQLList(GraphQLString)}
    }),
});

var pages;

const helper = (query) => {
    body.query.match["content"] = query;
    console.log(body)
    return client.search({index:'search_engine_test',  body:body, type:'urls'})
    .then((results) => {
        return results.hits.hits.map((hit) => hit._source)
        // for(index in results.hits.hits){
        //     result = results.hits.hits[index]
            //console.log(result)
            //console.log({id: result._id, url: result._source.url, content: result._source.content})
            //pages.push({id: result._id, url: result._source.url, content: result._source.content})
       //}
    })
    .catch(err=>{
        console.log(err);
    });
}

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        page: {
            type: new GraphQLList(PageType),
            args: {content:{type: GraphQLString}},
            async resolve(parent, args){
                return await helper(args.content);
                //return {url: "test", content: [args.content], keywords: ['a']}
            }
        },
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
});
