const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var userDao = require('../DAO/userDAO');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://www.googleapis.com/auth/gmail.compose',
                'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const mailOptions = {
  from: 'lpezo777@gmail.com',
  subject: '[proceso %name%] aviso de termino de proceso',
  html: '<p>El proceso del proyecto [%name%] ya ha terminado, puede descargar el excel desdel la pagina web del aplicativo.</p>'
};

const sendAvisoFin = (proy) => {
  return new Promise((resolve, reject)=>{
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) //return console.log('Error loading client secret file:', err);
        return reject(err);
      // Authorize a client with credentials, then call the Gmail API.
      userDao.getUser(proy.user).then(user=>{
        mailOptions.to = user.email;
        mailOptions.subject = mailOptions.subject.replace("%name%", proy.name);
        mailOptions.html = mailOptions.html.replace("%name%", proy.name);
        authorize(JSON.parse(content), sendMessage, (err, res)=>{
          if (err)        
            return reject(err);
          resolve(res);
        });
      }).catch(err=>{
        reject(err)
      })
    });
  })
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, next) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, next);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth, next) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

function sendMessage(auth, next) {
  var raw = makeBody(mailOptions.from, mailOptions.to, 
    mailOptions.subject, mailOptions.html);
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
          raw: raw
      }

  }, next);
}

nmodule.exports = {
  sendAvisoFin
};