const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
function convertPdfUrlToSiteUrl(pdfUrl) {
  // Extract the unique identifier from the PDF URL
  const parts = pdfUrl.split('/');
  // console.log(parts);
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
    //tableDATA
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
      // console.log("siteUrl: ",siteUrl)
    }
  tableData.push([name[0],links[0]]);
}
});
 
// listdata
const listItems = $('div.sample-paper ul.colored-links li');
const listData = [];

// Map each list item to a promise that resolves when the data is fetched
const promises = listItems.map(async (index, element) => {
  const chapterNumber = $(element).find('span').text().trim();
  const chapterName = $(element).find('em.chapterName').text().trim();
  const pdfLinks = $(element).find('.download-pdf a');
  const pdfNormalLink = pdfLinks.eq(0).attr('href');
  const newURl = `https://www.selfstudys.com/${pdfNormalLink}`;
  const htmldata = await axios.get(newURl);
  const a = cheerio.load(htmldata.data);
  const sourceLinks = a('div.pdf-content').find('div.PDFFlip').attr('source');
  listData.push([chapterNumber + ". " + chapterName, sourceLinks]);
}).get();


// pdf
const pdfData=[]
function isValidURL(string) {
  // Regular expression to check URL format
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(string);
}
const sourceLink = $('div.pdf-content').find('div.PDFFlip').attr('source');
const sourceName= $('div.ft-lora').find('h1').text()
console.log(sourceLink)
if(sourceName!="" && isValidURL(sourceLink)){
pdfData.push([sourceName,sourceLink])}


// Wait for all promises to resolve
await Promise.all(promises);
    if(listData.length>0){
    res.json(listData);
    }
  else
  if(tableData.length>0)
    res.json(tableData);
  else{
    res.json(pdfData);
  }
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});