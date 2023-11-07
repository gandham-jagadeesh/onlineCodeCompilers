import os from "os";
import cluster from "cluster";
import { codeExecutionConsumer } from "./consumer";

export default function scale(app:any){

    let cpuThreads = os.cpus().length;
    if(cpuThreads >=4) cpuThreads=4;
    if(cluster.isPrimary){
        for(let i=0;i<cpuThreads;i++){
            cluster.fork();
        }

        cluster.on("exit",(worker,code,signal)=>{
         console.log("exiting ",worker.process.pid)
         cluster.fork()
        })




        app.listen(3000,()=>{
         console.log(`listening at port`,3000);
        })
    }else{
    
     app.listen(3000 + process.pid,()=>{
    console.log("listening at process",process.pid);
     })
     codeExecutionConsumer();
    }
}