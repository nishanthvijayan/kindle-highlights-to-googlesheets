# kindle-highlights-to-googlesheets
  
   
![logo](https://github.com/nishanthvijayan/kindle-highlights-to-googlesheets/blob/master/kindle-highlights-to-googlesheets.jpg)
  
Export your kindle highlights to Google Sheets.

kindle-highlights-to-googlesheets scrapes your kindle highlights from your [Amazon Read](https://read.amazon.com/notebook) page and exports them to a Google Sheet that you specify.

## Setup
Your credentials for accessing Amazon & Google Sheets should be stored in a file named credentials.json.  
Look at the `credentials.example.json` file for reference.

### Amazon credentials
Your amazon login credentials should be added to the username & password keys in credentials.json.
This script requires your credentials to access your highlights at [Amazon Read](https://read.amazon.com/notebook) .
```
{
    "amazon": {
        "username": "your_email@gmail.com",
        "password": "your_password"
    },
    ...
```

### Google Sheet setup
This project uses the service account authentication flow for accessing Google Sheets.  
To set it up, do the following:  

1. Go to the [Google APIs Console](https://console.cloud.google.com/apis/dashboard).
2. Create a new project.
3. Click Enable API. Search for and enable the Google Sheets API.
4. Create credentials for a Web Server to access Application Data.
5. Name the service account and grant it a Project Role of **Editor**.
6. Download the JSON file.
7. Use the contents of the JSON file to fill the credentials key under sheets key in our credentials.json

```
    "sheets": {
        "sheetID": "XXXXXXXXXXXXXXXXXX",
        "credentials": {
            "type": "service_account",
            "project_id": "XXXXXXXXXXXXXXXXXX",
            "private_key_id": "XXXXXXXXXXXXXXXXXX",
            "private_key": "XXXXXXXXXXXXXXXXXXx",
            "client_email": "XXXXXXXXXXXXXXXXXX",
            "client_id": "XXXXXXXXXXXXXXXXXX",
            "auth_uri": "XXXXXXXXXXXXXXXXXX",
            "token_uri": "XXXXXXXXXXXXXXXXXX",
            "auth_provider_x509_cert_url": "XXXXXXXXXXXXXXXXXX",
            "client_x509_cert_url": "XXXXXXXXXXXXXXXXXX"
        }
    }
```

8. Copy the **client_email** value from the downoaded JSON file.
9. Open Google Sheets & create a new spreadsheet.
10. Now click the Share button in the top right, and paste the client email into the People field to give it edit rights.
11. Copy the sheetID of this newly created spreadsheet. SheetID can be found from the URL of your spreadsheeet. For example:
In this spreadsheet "https://docs.google.com/spreadsheets/d/14IiBOsxwf7AdgHjfZ5FMDgsf-rBXL4KufxhjeCWADhY/edit", the sheetID is "14IiBOsxwf7AdgHjfZ5FMDgsf-rBXL4KufxhjeCWADhY"
12. Paste the sheetID against the sheetID key in our credentials.json file.

That's it. You're good to go.

### Executing the script
First install the required dependencies by running: 
```
npm install
```

To start the script, use:
```
npm start
```

## Warning
The way it works right now, the script performs a full replace of any existing content in the spreadshhet. So any changes you make to the spreadsheet will be erased if you run the script again.  

Storing your amazon credentials in a plaintext file is not a good idea. Make sure that you never commit the file to version control or make the file public.


