
const { 
    publish,
    subscribe } = require('../service/rabbitMQ');
/**
 * RabbbitMQ Controller
 */
class RabbitMQController{

    constructor(){
        this.publisher = null;
    }
/**
 * Fetch the RabbitMQ Message from Queue
 */
    getRabbitMqMessage(){
        return new Promise( async (resolve, reject) =>{
           
            try {
                let subscriptionEmitter = await subscribe(
                    'testExchange',
                    'testKey',
                    'queueName',
                    10
                );          
                subscriptionEmitter.on('data', (count, message, ack) => {
                    let response = { 'status': (this.publisher !== null)? 'Running':'Stopped', 'topic': JSON.parse(message)};            
                    ack();
                    subscriptionEmitter.stop();
                    resolve(response);                    
                });
                    subscriptionEmitter.on('error', (error) => {
                    reject(error);
                });
                          
            } catch (err) {
               reject(err);
            }
        });
        
    }
    /**
     * Publish to the messaging queue when the mode is start . Stop the messaging queue
     * @param {*} mode start/stop string
     */
    publishToRabbitMQ(mode){
        return new Promise( (resolve, reject)=>{
            try{
                if(mode.toLowerCase() === 'start' && this.publisher ===null){
                        this.publisher = setInterval( async()=>{ 
                        let randomString = Math.random().toString(36).substring(2,15);
                            try{
                                await publish('testExchange', {message: randomString, id:new Date()}, 'testKey');
                            } catch(e){
                                console.log(e);
                            }
                        }, 1000);
                    
                    resolve( { 'message': 'RabbitMQ Started Publishing Message to Queue(Topic).'});
                }else if(mode.toLowerCase() === 'stop'){
                    clearInterval(this.publisher);
                    this.publisher = null;
                    resolve({ 'message': 'RabbitMQ Stopped Publishing Message to Queue(Topic).'});
                }

            }catch(err){
                reject(err);
            }
        });
        
    }

}

module.exports = RabbitMQController;