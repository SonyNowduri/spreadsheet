const express = require("express");
const {google} = require("googleapis");
const keys = require("./keys.json");
const fs = require('fs');
const readline = require('readline');
const fetch = require("node-fetch");
const app = express();

app.listen(3006,()=>{
    console.log("Running at http://localhost:3006")
})

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('keys.json', (err, content) => {
    // console.log(content)
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
  });

  function authorize(content, callback) {
    //   console.log(content)
    const {client_secret, client_id, redirect_uris,private_key_id,private_key,client_email,auth_uri,token_uri} = content;
    console.log(redirect_uris)
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_email, token_uri,auth_uri);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        // console.log(TOKEN_PATH)
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

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
        if (err) return console.error('Error while trying to retrieve access token', err);
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

  

module.exports = app