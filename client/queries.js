import {gql} from 'apollo-boost';

const getPageQuery = gql`
    query($content: String){
        page(content: $content){
            
        }
    }
`

export{getPageQuery};