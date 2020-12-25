const express = require('express');
const router = express.Router();
const RabbitMQController = require('../controllers/rabbitMq.controller');
const RabbitMQInstance = new RabbitMQController();

/* GET RabbittMQ Queue Message(POP Queue). */
router.get('/', async (req, res, next) => {
  try{
    res.status(200).send(await RabbitMQInstance.getRabbitMqMessage());
  }catch(e){
    res.status(500).send({status: 'error', message: e.message} );
  }

});

/** START/STOP Pushing Message to RabbitMQ Queue.*/
router.post('/', async (req, res, next)=> {
  try{
    let mode = req.query.mode;
    res.status(200).send(await RabbitMQInstance.publishToRabbitMQ(mode));
  }catch(e){
    res.status(500).send({status: 'error', message: e.message} );
  }
  
});

module.exports = router;
