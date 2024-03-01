const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
function convertPdfUrlToSiteUrl(pdfUrl) {
  // Extract the unique identifier from the PDF URL
  const parts = pdfUrl.split('/');
  const identifierWithExtension = parts.pop().split('.')[0]; // Remove the file extension

  // Construct the site URL with the identifier
  const siteBaseUrl = 'https://www.selfstudys.com/sitepdfs/';
  const siteUrl = `${siteBaseUrl}${identifierWithExtension}`;

  return siteUrl;
}
// Endpoint to scrape links from a table on a webpage
app.get('/', async (req, res) => {
  try {
    const url = req.query.url; // Get the URL from the query parameters
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    

    const response = await axios.get(url);
    // console.log("response : ", response.data)
    const $ = cheerio.load(response.data);
    
    // Select the table you want to scrape (replace 'table-selector' with the appropriate CSS selector for your table)
    const table = $('table > tbody > tr');
    const tableData = [];
  table.each(function() {
  const name  = $(this).find('td').map((i,el)=>$(el).text()).get();
  const links  =$(this).find('td a').map((i, el) => $(el).attr('href')).get();
  // console.log("HAHAHA", links[0])

  // https://www.selfstudys.com/sitepdfs/
  if(parseInt(name[0].charAt(0))){
    if(links.length>0){
      const pdfUrl =links[0]
      const siteUrl = convertPdfUrlToSiteUrl(pdfUrl);
      links[0]=siteUrl
      console.log("siteUrl: ",siteUrl)
    }
  tableData.push([name[0],links[0]]);
}
});


    res.json(tableData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
