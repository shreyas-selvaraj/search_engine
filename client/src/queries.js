import { gql } from 'apollo-boost';

const getPagesQuery = gql`
    query($content: String){
        page(content: $content){
            url
            title
            description
            content
            keywords
        }
    }
`

export{getPagesQuery};