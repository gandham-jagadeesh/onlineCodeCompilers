import dockerode from "dockerode";
 const docker = new  dockerode();

 export default  async function  getDockercontainer(code:string,language:string){
    console.log(code,language);
    const containerConfig  = {
        image : getImage(language),
        Cmd   : getExecutionCommand(code,language),
        Tty: true
    }
    const container =  await docker.createContainer(containerConfig);
    return container;
}


function getImage(language:string){
    console.log("getImage",language);
    let imageName;
    switch(language){
        case "c":
            imageName = "gcc";
            break
        case "cpp":
            imageName = 'gcc';
            break
        case 'python3':
            imageName = 'python3';
            break
        case "js":
            imageName = 'node:20.9.0-slim'
            break
        default :
         throw new Error("language error")
    }
 return imageName;
}



function getExecutionCommand(code:string,language:string){
 let cmd:string[];
 switch(language){
    case "c++":
        cmd = [`bash -c echo ${code} > myapp.c && g++ -o myapp myapp.cpp ./myapp`];
        break
    case "js":
        cmd = ['node','-e',code];
        break
    case 'c':
        cmd = [`bash -c echo ${code} > myapp.c && gcc myapp myapp.c ./myapp`];
        break
    case 'py':
        cmd = [`bash -c echo ${code} > myapp.py && python myapp.py`];
    default:
      throw  new Error("not specified language");

 }
return cmd;
}



 export async function dockerExecuteCode(code:string,language:string){

  return new Promise(async (resolve,reject)=>{
    
    const container = await getDockercontainer(code,language);
    await container.start();
    
    
    const tle = setTimeout(async ()=>{ 
        console.log('tle');
        resolve({result:"infinte loops may be present in code or time limit error",success:false});
       await container.stop();
     },2000);


  const dockerExitStatus = await container.wait();
  const logs             = await container.logs({stdout:true,stderr:true});

  if(dockerExitStatus.StatusCode === 0 ){
    console.log(logs.toString());
    resolve({results:logs.toString(),sucess:true});
    clearTimeout(tle);
    await container.remove();  
}
  else{                                //code had bugs : compiler error or run time error
    resolve({result:logs.toString(),success:false});
    clearTimeout(tle)
    await container.remove();
  }
})

}