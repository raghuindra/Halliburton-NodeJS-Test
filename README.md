# Halliburton-NodeJs- GET/POST

## PreRequisite
* RabbitMQ

    * Get [RabbitMQ Here](https://www.rabbitmq.com/download.html)

    * To Get Started With RabbitMQ, [Visit Here](https://www.rabbitmq.com/getstarted.html)

* Erlang Client
    * Get [Erlang Client Here](https://www.rabbitmq.com/erlang-client.html)

* NodeJS >10 & NPM
    * Get [NodeJS Here](https://nodejs.org/en/download/)


## RabbitMQ Web Interface
* Once RabbitMQ and Erlang is installed and Running, Visit `http://localhost:15672/` for Web Interface
* Default Login, `username: guest`  and  `password: guest`
* Check "Exchnage" and "Queues" Tab once NodeJs app started running.
    * Exchnage: `testExchnage`
    * Queue: `queueName`
* Queue is where all Published messages count listed and status for the Exchange `testExchange`.

## Install NPM Packages of NodeJs Test Application
* `npm install`
    * It will install all depedency packages for application.
## Run NodeJs Server
* `npm start`
    * NodeJs Application will start on port 3000
## POST/
http://localhost:3000?mode=start

* Will Start publishing Messages to RabbitMQ
* Publish Message Format: 
    * `{message: 'randomString', id:'current date'}`

## POST/
http://localhost:3000?mode=stop

* Will Stop Publishing Message to RabbitMQ

## GET/
http://localhost:3000/

* Will Fetch/Consume One Message from RabbitMQ Queue with current status of Publishing (Stopped/Running) based on recent POST request.

* Response Format:
    * `{"status":"Running","topic":{"message":"b21trm","id":"2020-12-24T22:23:24.325Z"}}`

    * `{"status":"Stopped","topic":{"message":"r34bao","id":"2020-12-24T22:34:13.325Z"}}`

## Run Unit Test
* `npm test`
    * It will execute the test cases for application

