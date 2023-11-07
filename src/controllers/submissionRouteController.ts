import {Request,Response} from "express";
import connectMessageBroker from "../config/messageBroker";
import codeExectionEnvinornment from "../util/producer";

async function submissionController(req:Request,res:Response){
 const body = req.body;
const code:String = body.code;
 const language:String= body.language;
 try{
    const {connection,channel} =  await connectMessageBroker();
    await codeExectionEnvinornment(connection,channel,code,language,res);
 }
catch(e){
    console.log(e);
}
}

export default submissionController;