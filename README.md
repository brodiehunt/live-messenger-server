# Real time Messaging Application

Date: 12-01-2024 \
Prepared by: Brodie Hunt \
This is the server repository for the Chatter application. \
The client repository can be found here: [Client Repo](https://github.com/brodiehunt/live-messenger-client) \
You can see the full docs for the application there.

## Table of contents

- [Overview](#overview)
- [Environment and Setup](#2-development-environment-and-setup)
- [Tech Stack](#3-technology-stack)

## 1. Overview

**Name**: Chatter (real time messenger)

**Live Site**: [Chatter Application](https://brodie-chatter-app.netlify.app/)

**Description**: Chatter is a real-time web-based messenger application that allows users to chat instantly in groups and directly with other users. Users can manange friendships, personalize their chat settings to customize their experience, and communicate with other users with real time messaging and notifications. Chatter offers features like direct messaging, group chat messaging, friendships, real-time notification and simple login and auth with google Auth.

**Objective**: To build a user-friendly, seamless, real-time messaging platform for personal communication between friends and other users.

## 2. Development Environment and Setup

1. Clone this repository:

```
https://github.com/brodiehunt/live-messenger-server.git
```

2. Install the dependencies

```
  npm install
```

3. Set up environment variables:

- There is a text file in the root of the project named environmentVars.txt. This holds the environment variables you will need to configure to get the application working.

  1. create a .env file in the root directory.
  2. Copy the contents of the 'environmentVars.txt' file into the .env file.
  3. Add your own values to these keys.

There are a few services to you will to configure in order to use all the features of this application. These include.

**MongoDB**

- You have two options.
- You can either install mongoDB community on your computer. You can find out how to do that here: \
  [Install MongoDB Community](https://www.mongodb.com/docs/manual/installation/)
- Or you can create a mongoDB Atlas account and connect to a cluster. You can find out how to do that here: \
  [Connect Database Deployments](https://www.mongodb.com/docs/atlas/create-connect-deployments/)
- Either way, you will need obtain your Database connection string for the DEV_DB environment variable.

**SendGrid for reset emails**

- If you want the reset password functionality to work, you will need to create a sendGrid account and obtain your own API Key.
- You can sign up here: [Sign up sendGrid](https://sendgrid.com/en-us/free?source=sendgrid-nodejs)
- Grab your api key from here: [API Key](https://app.sendgrid.com/settings/api_keys)
- You can still run the server without this key. You won't be able to use the password reset functionality.

**Google oauth 2.0**

- To use google oauth 2.0 youll need to obtain a client id and client secret. \
  You can find out how to do that here: [Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849?hl=en)
- You can still use the application without this key. You won't be able to login or register with google though.

4. Run the server application

- You can run the application in dev environment with the command:

```
npm run dev
```

## 3. Technology Stack

- **Frontend**: React, Styled-components, React Router, Context API
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: Passport.js - JWT and Google OAuth
- **Real-time Communication**: Socket.io
- **Testing**: Jest, SuperTest, Vitest, React-testing-library
- **Hosting**: Client: Netlify. Server: Heroku
