function checkVirginiaCities() {
  var url = "https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.VA.json?vaccineinfo";
  var headers = {
             "contentType": "application/json",
             "headers":{
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0",
                        "Accept": "/",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Referer": "https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-link2-coronavirus-vaccine",
                        "Connection": "keep-alive"}
             };
  var response = UrlFetchApp.fetch(url, headers);
  var data = JSON.parse(response.getContentText()).responsePayloadData.data['VA'];
  var data2 = JSON.stringify(data);
  var citylist = []
  var foundone = citylist.some(v => data2.includes(v));
  var availablecities = []
 
   for(i = 0; i < data.length; i++){
     //Logger.log(data[i].status)
      if(data[i].status == 'Available') {
       // Logger.log(data[i].city)
        availablecities.push(data[i].city)
      }
 
 
  }
 
  var foundone = citylist.some(v => availablecities.includes(v));
  if(foundone && HasItBeenTheTime(30)) {
  checkVirginia()

  }

}
function checkVirginia() {
  var url = "https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.VA.json?vaccineinfo";
  var headers = {
             "contentType": "application/json",
             "headers":{
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0",
                        "Accept": "/",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Referer": "https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-link2-coronavirus-vaccine",
                        "Connection": "keep-alive"}
             };
  var response = UrlFetchApp.fetch(url, headers);
  var text = response.getResponseCode();
  var data = JSON.parse(response.getContentText()).responsePayloadData.data['VA'];
  var data2 = JSON.stringify(data);
  var data3 = data.map((p) => `City: ${p.city},   \t Status: ${p.status}, \t Total Available: ${p.totalAvailable} \n`).toString()
  var datatest = "Hey there something is totalAvailable"

  var strstart = data2.search("Available");
  var strstart2 = data2.search("Fully Booked");
  var strstart3 = data2.search("totalAvailable");

      //Identify who to email
 

  if (strstart > 0 || strstart3 > 0) {
    Logger.log("Something is available in Virginia");

    // Subject of email message
  var email = "YOUREMAIL@gmail.com"; 
  var subject = "A Virginia CVS Appointment is Available"; 
  // Email Body can  be HTML too 
  var body = "Hey, there is an appointment available at a Virginia CVS. Go here to sign up: \nhttps://www.cvs.com/immunizations/covid-19-vaccine. \n\nChoose the state, then type in the city that has availability below. Here is the current list: \n\n" + data3;
      // If allowed to send emails, send the email with the PDF attachment
  if (MailApp.getRemainingDailyQuota() > 0 && foundone > 0) 
    GmailApp.sendEmail("", subject, body, {
      bcc: email,
    
    });

  } else if (strstart2 > 0){
    Logger.log("No Virginia CVS Appointments available");
     var email = "YOUREMAIL@gmail.com"; 
    // Subject of email message
  var subject = "No Virginia CVS Appointments available"; 
  // Email Body can  be HTML too
    var body = "Hey, there are currently no appointments available at a Virginia CVS. Go here to sign up:\n https://www.cvs.com/immunizations/covid-19-vaccine. \nChoose the state, then type in the city that has availability below. Here is the current list: \n\n" + data3;
   


  } else {
    Logger.log("Something is wrong");
   var email = "YOUREMAIL@gmail.com"; 
    // Subject of email message
    var subject = "Error in CVS Checker (Virginia)"; 
  // Email Body can  be HTML too 
  var body = "Hey, something went wrong with the CVS Appointment Checker \n" + data3;
    if (MailApp.getRemainingDailyQuota() > 0) 
    GmailApp.sendEmail("", subject, body, {
      bcc: email,
    });
  }
 

    Logger.log(data3);

  Logger.log(data);
  Logger.log("Total Available - " + strstart);
  Logger.log("Fully Booked - "+ strstart2);
  Logger.log("totalAvailable - " + strstart3);
}
function HasItBeenTheTime(howManyMinutes) {
  // set here how many minutes before another email can be sent
    var timecell = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(1,1)
    var cell = timecell.getValue()
  //Logger.log(cell)
  let now = +new Date();

  let createdAt = cell;

  const timevalue = 60 * howManyMinutes * 1000;
  var compareDatesBoolean = (now - createdAt) > timevalue;
  //Logger.log(compareDatesBoolean)
  if (compareDatesBoolean) {
    timecell.setValue(now)
    //Logger.log(compareDatesBoolean)
    return compareDatesBoolean;

  } else {
    return false
  }
}
