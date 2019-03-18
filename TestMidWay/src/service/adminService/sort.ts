import { provide } from 'midway';
import {getRepository} from "typeorm";
import {Sort} from "../../entity/Sort";


@provide()
export class AdminSortService  {

  async get(options){
    const {index,size,name,isEnable,orderBy}=options;
    const listAndCount=await getRepository(Sort)
      .createQueryBuilder("sort")
      .where("name like :name",{name:`%${name}%`})
      .andWhere("isEnable in (:...isEnables)",{isEnables:isEnable===undefined?[0,1]:[isEnable]})
      .orderBy(orderBy.name,orderBy.by)
      .skip(index-1)
      .take(size)
      .getManyAndCount()
    ;
    return listAndCount;
  }

  async save(options){
    let flag=true;
    const sortEntity=getRepository(Sort).create({...options});
    await getRepository(Sort).save(sortEntity).catch(e=>{flag=false});
    return flag;
  }

  async delete(ids:number[]){
    let flag=true;
    // await getRepository(Sort).delete(ids).catch(e=>{flag=false});
    const result=await getRepository(Sort).delete(ids);
    if(!result.raw.affectedRows){
      flag=false;
    }
    return flag;
  }
}