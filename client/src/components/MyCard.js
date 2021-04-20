import React from "react";
import {CardContent, Typography, Card, Accordion, AccordionSummary, AccordionDetails} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "../index.css"

const MyCard = ({ data: {url, title, description, content, keywords, scraped_keywords } }) => {
    if(!title){
        title = url;
    }
    var url_text = url;
    url_text = url_text.split('?')[0];
    url_text = url_text.split('#')[0];
    
    if(keywords === "None"){
        keywords = ""
    } 

    return (
        <Card style={styles.card}>
            <CardContent> 
                <Typography color="textSecondary" style={styles.url_text}>{url_text}</Typography>
                <a target="_blank" href={url} style={styles.title}>{title}</a>
                <Typography style={styles.description}>{description}</Typography>
                {/* <Typography color="textSecondary">{keywords}</Typography> */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography style={styles.accordion_summary}>Keywords</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography style={styles.accordion_summary}>{keywords}</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography style={styles.accordion_summary}>Scraped Keywords</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography style={styles.accordion_summary}>{scraped_keywords}</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography style={styles.accordion_summary}>Page Content</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography style={styles.accordion_summary}>{content}</Typography>
                        </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    )
}

var styles = {
    card: {
        height: "20vh",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "#fff",
    },
    accordion: {
    },
    url_text: {
        fontSize: "12px",
        fontFamily: 'Lato, sans-serif',
    },
    description: {
        marginBottom: 10,
        fontFamily: 'Lato, sans-serif',
    },
    title: {
        fontFamily: 'Lato, sans-serif',
    },
    accordion_summary: {
        fontFamily: 'Lato, sans-serif',
        fontSize: "12px"
    }
}

export default MyCard;