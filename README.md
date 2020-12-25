# Halliburton-NodeJs- GET/POST

POST/
http://localhost:3000?mode=start

"Will Start publishing Messages to RabbitMQ"
Message Format: {message: 'randomString', id:'current date'}

=========================================================================================================
POST/
http://localhost:3000?mode=stop

"Will Stop Publishing Message to RabbitMQ"

===========================================================================================================

GET/
http://localhost:3000/

"Will Fetch/Consume One Message from RabbitMQ Queue with current status of Publishing (Stopped/Running) based on recent POST request."

Response:
{"status":"Running","topic":{"message":"b21trm","id":"2020-12-24T22:23:24.325Z"}}
{"status":"Stopped","topic":{"message":"r34bao","id":"2020-12-24T22:34:13.325Z"}}

=============================================================================================================
