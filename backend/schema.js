const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLNumber, GraphQLObject } = graphql;

const elasticsearch = require('elasticsearch');
const { version } = require('cheerio');

const client = new elasticsearch.Client({
    node: 'https://localhost:9200',
 });

var body = {
    size: 240,
    from: 0,
    query: {
        //"match_all": {}
        // match: {
        //     "content": "how to create post",
        // }
        "multi_match" : {
        "query":      "",
        "type":       "best_fields",
        "fields":     [ "url^2", "title^4", "description^4", "keywords^2", "content"],
        "operator":   "or",
        "fuzziness": "AUTO"
        },
    },
    //"sort": { "_score": { "order": "desc" }}
}

const PageType = new GraphQLObjectType({
    name: 'Page', //name of type
    fields: () => ({ //has these fields
        url: {type: GraphQLString},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        content: {type:GraphQLString},
        keywords: {type: GraphQLString},
        scraped_keywords: {type: GraphQLString}
    }),
});

var pages;

const helper = (query) => {
    body.query["multi_match"]["query"] = query;
    console.log(body)
    return client.search({index:'search_engine_test',  body:body, type:'urls'})
    .then((results) => {
        return results.hits.hits.map((hit) => hit._source)
        
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
