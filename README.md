[![Build Status](https://travis-ci.org/epaulson10/didactichat.svg?branch=master)](https://travis-ci.org/epaulson10/didactichat)
# didactichat
Copyright (c) 2016 Erik Paulson

Reinventing the wheel is useful if you want to become an automotive engineer. I want to become skilled in web development, so I am reinventing the chat-room. The purpose of this project is to develop a simple chat room based on NodeJS for the purpose of learning web development. The hope is that others may use this as an example for their own learning.

Didactichat allows for multiple chat rooms, meant for different topics of conversation, nicknames, and features a chat history REST API to fill the client with a desired number of messages. The project uses mocha for unit testing.

## Legal
Didactichat is licensed under the terms of the GNU GPL V3. See the LICENSE file for the complete text of the license.

## Running the application
First install dependencies
> $ npm install

Run the server on the default port 3000

> $ npm start

Run the server on a custom port (for example, 8080)

> $ PORT=8080 npm start

To run the unit tests

> $ npm test

## Contributing
The main server-side application is in the root of the repo in chat.js. The client side application lives under /public/. The chat history API lives in chat_log.js in the root. Possible areas for contribution include:

1. Writing more tests.
2. Enabling private chat rooms.
3. Adding database support for the chat
4. UI improvments.

## Contact
Please send any correspondance about didactichat to epaulson10@gmail.com.
