import React from "react";
import {CardContent, Typography, Card} from "@material-ui/core";

const MyCard = ({ data: {url, content, keywords } }) => {
    var contentString = ""
    if(!keywords){
        keywords = []
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
                <Card style={styles.card}>
                    <CardContent>
                        <a target="_blank" href={url}>{url}</a>
                        <Typography variant="body2">{content}</Typography>
                        <Typography color="textSecondary">Keywords: {keywords.map((keyword) => {return keyword + ", "})}</Typography>
                    </CardContent>
                </Card>
    )
}

var styles = {
    card: {
        height: "20vh",
        width: "20vw",
    }
}

export default MyCard;