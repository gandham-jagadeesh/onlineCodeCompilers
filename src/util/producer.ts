import {v4 as uuidv4} from "uuid";

const codeExecutionqueue = 'executionQueue';

export default async function codeExectionEnvinornment(connection:any,channel:any,code:any,language:any,res:any){

    const responseQueue = await channel.assertQueue("",{exclusive:true});

    const responseQueueName     = responseQueue.queue;
    const correlationId = uuidv4();

    console.log('queue name is unique name is ',responseQueueName,correlationId);
    
    channel.consume(responseQueueName,(msg:any)=>{
        console.log("producerQueue",msg.properties.correlationId,correlationId);
        if(msg.properties.correlationId == correlationId){
            const response = JSON.parse(msg.content.toString());
            res.status(200).json(response);
            channel.close();
            connection.close();
        }
    },{
        noAck:true
    });
 channel.sendToQueue(codeExecutionqueue,Buffer.from(JSON.stringify({code,language})),{
    correlationId,
 replyTo:responseQueueName
 })

}