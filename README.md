Node JS, React JS, GraphQL/Apollo, Elasticsearch, Redis, Kubernetes, Puppeteer

Distributed search engine that concurrently scrapes one million top domains and handles search queries using Elasticsearch.
Have to fix repeat error due to asynchronous tasks not updating Redis cache properly. Then push to kubernetes. 

Other details: 
Breadth first search using queue, subdomain scanner, keyword extraction, weighted elasticsearch queries, will distribute scraping of one million top domains across multiple nodes. 

<img width="2048" alt="Screen Shot 2021-04-20 at 07 28 50" src="https://user-images.githubusercontent.com/68854231/115415055-94615200-a1c4-11eb-86f7-42786b675d40.png">

<img width="2048" alt="Screen Shot 2021-04-20 at 07 33 53" src="https://user-images.githubusercontent.com/68854231/115415075-97f4d900-a1c4-11eb-807b-d9c12344b563.png">

<img width="602" alt="Screen Shot 2021-04-20 at 07 38 10" src="https://user-images.githubusercontent.com/68854231/115415089-9aefc980-a1c4-11eb-9263-a029343ae1c3.png">
