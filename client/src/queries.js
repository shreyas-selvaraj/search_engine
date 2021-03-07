import { gql } from 'apollo-boost';

const getPagesQuery = gql`
    query($content: String){
        page(content: $content){
            url
            content
            keywords
        }
    }
`

export{getPagesQuery};