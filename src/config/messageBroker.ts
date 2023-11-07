import amqp from "amqplib";



async function connectMessageBroker(){
    const connection              = await amqp.connect("amqp://localhost:5672");
    const channel                 = await connection.createChannel();
    return {channel,connection}
 
}

export default connectMessageBroker;
