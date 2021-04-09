# Serverless Chainlink NodeJS External Adapter Template

This template provides a basic framework for testing/debugging Chainlink external adaptors hosted on serverless locally via VS Code debugging tools. It also provides a framework for deploying serverless functions to the cloud via AWS. 


## Prerequisites
- Node js version 14.x installed - https://nodejs.org/en/download/
- Visual Studio Code installed - https://code.visualstudio.com/Download
- An AWS account 
- A tool/client for sending API requests (Postman, Soap UI, curl, etc.)
- An api key from https://financialmodelingprep.com/

## Using the template

Clone this repo. Feel free to change the name of the folder after cloning

```bash
git clone https://github.com/johudsonRx/serverless-external-adaptor.git
```

Enter into the newly-created directory

```bash
cd serverless-external-adaptor
```

## Output

The output should return the current stock price of Apple in the following format:

```json
{"price": 127.4481}
```

The code can be editted to return other data like the exchange AAPL trades on, day lows and day highs, market cap, and more.

## Installing  Dependencies

From the root of the directory, run:


```bash
npm install
```

The following dependencies have to be installed independently:

```bash
npm install -g serverless 
npm install dotenv
npm install serverless-offline --save-dev
npm install serverless-offline -g
npm install @chainlink/external-adapter
```

# Testing and Deploying

Serverless functions are deployed to and live in the cloud. When testing, we may need a way of debugging these functions locally. With Visual Studio Code, we can set breakpoints on different lines of the serverless function. This allows us to pause the api request line-by-line in order to see things like: the request data being passed to our serverless function, what the  function is doing to that request data, and what response the  function is returning. This can all be done on our local machines before being deployed to the cloud. 
### 1. Setup an IAM User in AWS Console 

- Navigate to the AWS console and look for "IAM" under "AWS services" 
- If you do not already have one or would like to create a new one, click on the "Users" tab then click "Add user".
- Give your user a name and select "Progrommatic access" and hit next.
- Give it administrator access and hit next until you see the user created. You should see a success notification on the page.
- Once the user is created you should see an "Access key ID" and "Secret access key". Keep these handy for now and keep them safe later as they have access permissions to the AWS console

### 2. Configure a User in the Terminal for AWS

-Open up the terminal and type:

```bash
serverless config credentials --provider aws --key <ACCESS_KEY_ID> --secret <SECRET_ACCESS_KEY>
```

- Where <ACCESS_KEY_ID> is the access key id and <SECRET_ACCESS_KEY> is secret access key from step 1.
  - A successful response will look something like this: "Serverless: Setting up AWS..."
  - Another way to confirm that the credentials were set:
    ```bash
    cat ~/.aws/credentials 
    ```
  
### 2.1 Create .env file with API key
  - If you haven't yet, go to https://financialmodelingprep.com/, sign up for a free account, and get an API key.
  - Create a `.env` file in the root of the project directory as follows:
    
<img width="185" alt="API KEY" src="https://user-images.githubusercontent.com/19862040/113874700-10e74000-9784-11eb-998c-c200d9ebd6f0.png">

  - Replace your the API key with the api key that you have obtained from https://financialmodelingprep.com/

### 2.2 Change the Path to your "serverless" npm module

- In the package.json, there will be a "debug" field in the "scripts" object of the package.json:
  ```bash
  "scripts": {
      "test": "./node_modules/.bin/_mocha --timeout 0",
      "start": "./node_modules/.bin/serverless offline -s dev",
      "debug": "SET SLS_DEBUG=* && node --inspect C:\\\\Users\\<YOUR_USER>\\AppData\\Roaming\\npm\\node_modules\\serverless\\bin\\serverless offline -s dev"
    }
  ```
- Configure the path in the debug field to point to the serverless node module on your local machine.
  - Note: The module should exist there after globally installing serverless

- Replace <YOUR_USER> with your machine's username for this path, assuming the serverless module is installed here and assuming you're running on windows
  - Note: This is a Windows path and it will vary depending on what OS you use. If the path is not correct, you will have to search your machne for the serverless module, copy the path to it, and then paste it into this debug field

### 3. Debug the example Serverless Function

#### Note: This repo is set up to be configured to run the lambda function locally in debug mode. You will know if this is the case after doing the following. If not, refer to step 4 for configuring the debugger
  
  - Open the "index.js" file and then scroll down to the "handlerv2" function.
  - Click on the left side of the line numbers of where you'd like the request to pause when running in debug mode. 
  <img width="306" alt="breakpoints" src="https://user-images.githubusercontent.com/19862040/113798906-0b590e00-9722-11eb-87d1-c5aa18a5e633.png">

  - Click on the "Run tab at the top and then select "Start Debugging". You should see a play menu pop up   
    <img width="117" alt="play menu" src="https://user-images.githubusercontent.com/19862040/113799326-df8a5800-9722-11eb-8eca-299381787f2f.png">
  
  - If successful, a terminal should pop up at the bottom of VS Code with an output similar to this:

    <img width="457" alt="localhost" src="https://user-images.githubusercontent.com/19862040/113799824-d352ca80-9723-11eb-8b00-6c4c15577433.png">
  
    - We will use the first POST route inside the rectangular box to make a request:  http://localhost:3000/dev/quote 

  
  ### 3.1 Send a Request

  - After you have set your break points and have your debugger running, open up your API tool send a POST request with the url from step 3 with a request body of:

```bash
{ "id": 0, "data": { "symbol": "AAPL"}}
```

Using curl:

```bash
curl -X POST -H "content-type:application/json" "http://localhost:3000/" --data '{ "id": 0, "data": { "symbol": "AAPL"}}'
```

### 3.2 Using the Debugger

- After hitting send, the request will pause on the breakpoints that you've sent. The debugger bar will now have a play button that will allow you to move from breakpoint to breakpoint

  - Ex. The request pauses at line 80 and you can see the value of every variable/parameter on this line at this particular time of the request. After hovering over the "event" parameter, it will show what this parameter is set to.
  - Note: Notice the play button that appears on the debugger. This will allow anyone sending this request to go from line 80 to 81 after pressing play

<img width="372" alt="live_debugger" src="https://user-images.githubusercontent.com/19862040/114025869-98e04f00-9843-11eb-8607-ecda5519c6fa.png">

<img width="73" alt="play_debugger" src="https://user-images.githubusercontent.com/19862040/114026266-0db38900-9844-11eb-8aa4-763eb4a3ef50.png">

Expected Output:
  - Note: This was the price of a share of APPL stock at the time of this documentation. The price changes and this is not a fixed number.

```bash
{"price": 127.4481}
```

### 4. Deploy the Serverless Function

If you were able to complete step 3 - 3.2, then you were able to test a serverless function locally. If you are satisfied with the result, then feel free to deploy one to the cloud in step 4. 

- In the terminal, type:

```bash
serverless deploy
```

An output similar to this should appear with a POST route at the bottom:

<img width="406" alt="deployed" src="https://user-images.githubusercontent.com/19862040/113872801-35dab380-9782-11eb-8db2-d2792b0353bd.png">

- Use this POST route and the request body from step 3.1 to send a request. 
  - The output should be the same as the output from step 3.1

### Test

Run the local tests:

```bash
npm test
```

# Final Comments

This external adaptor is a very basic example of sending a request for stock data and receiving a response. If we want to introduce some logic that does more than just returns a price, we can modify this in the createRequest function of the index.js file. In the handlerv2 method, we can add another field to object being passed to the callback function in order to see details about the event. This may be useful for modifying things like the frequency that our serverless function sends requests. The goal for this template is to get up and running quickly. 

## TODO:
- Add more error handling
- Add more tests
- Test other scenarios like data manipulation (if necessary)

## Inspiration/Links:

Debugging Lambda locally:
   - https://levelup.gitconnected.com/debugging-nodejs-lambda-functions-locally-with-breakpoints-dfb1e2e3c77d
   - https://www.youtube.com/watch?v=PJ12zbdOQWI

Deploying Lambda:

  - https://www.youtube.com/watch?v=71cd5XerKss

External Adaptor Template:

  - https://github.com/PatrickAlphaC/CL-EA-NodeJS-Template
