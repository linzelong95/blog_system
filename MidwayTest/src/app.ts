import "reflect-metadata";
import {createConnection} from "typeorm";



export default (app)=>{
  app.beforeStart(async ()=>{
    await createConnection();

  });
}
