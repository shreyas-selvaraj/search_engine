const subquest = require('subquest')

subquest.getSubDomains({
  host: 'http://google.com'
}, (err, results) => {

  if(err) {
    console.log('Error:', err);
    return;
  }

  console.log('Subdomains:', results);  
})