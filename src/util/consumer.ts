import connectMessageBroker from "../config/messageBroker";
const codeExecutionqueue = 'executionQueue';
import { dockerExecuteCode } from "./docker_logic";

 export async function codeExecutionConsumer() {
    const {connection,channel} =  await connectMessageBroker()
    channel.prefetch(1);
    channel.assertQueue(codeExecutionqueue);

    channel.consume(codeExecutionqueue,async (msg:any)=>{
        const  {code,language} = JSON.parse(msg.content.toString());
        try{
        
            const executionResult = await dockerExecuteCode(code,language);
            console.log("consumer Side",msg.properties.replyTo,msg.correlationId)
            channel.sendToQueue(msg.properties.replyTo,Buffer.from(JSON.stringify(executionResult)),{
            correlationId:msg.properties.correlationId
            });
            channel.ack(msg);
        }
        catch(e){
         console.log("error processing worker queue done");
         process.exit(1);
        }
    })
}