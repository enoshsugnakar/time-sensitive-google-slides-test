# time-sensitive-google-slides-test
A custom time sensitive test with Google slides, essential in recruiting. Build on appscript.

## Step 1

- Create a new Google Sheet (call it e.g. “Slide-Access-Log”).

- In Sheet1, label columns A and B:

- A as Email and B as Access time.

- This will record each user’s first‐click time in ISO format (UTC).

- Change the sharing settings to "Anyone with the Link" 

- Note its Spreadsheet ID from the URL.

## Step 2

- Go to script.google.com and add create a new project

- Replace the code base in code.gs from the code above

- Replace the slides id and sheets ID

- Change the time according to your requirements

## Step 3

- Click on Deploy on top right

- Click on the Gear icon and select Webapp

- Who has access: Anyone with google account (your domain if its internal)

- Click Deploy and copy the WebApp url - voila!
