import React from "react";
import {CardContent, Typography, Card} from "@material-ui/core";

const MyCard = ({ data: {url, content, keywords } }) => {
    var contentString = ""
    if(!keywords){
        keywords = []
    }
    else{
        keywords = keywords.splice(0, 5)
    }
    for(var i = 0; i < content.length; i++){
        if(contentString.length > 20){
            break;
        }
        contentString = contentString + content[i]
    }
    if(contentString.length > 250){
        content = contentString.substring(0, 250) + "   ..."
    }
    else{
        content = contentString
    }   

    return (
                <Card>
                    <CardContent>
                        <a target="_blank" href={url}>{url}</a>
                        <Typography variant="body2">{content}</Typography>
                        <Typography color="textSecondary">Keywords: {keywords.map((keyword) => {return keyword + ", "})}</Typography>
                    </CardContent>
                </Card>
    )
}


export default MyCard;