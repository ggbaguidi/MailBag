import Nedb from "nedb";
import * as path from "path";
const Datastore= require("nedb");

export interface IContact{
    _id?:number,name:string,email:string
}

export class  Worker{
    private db:Nedb;
    constructor(){
        this.db = new Datastore({
            filename: path.join(__dirname,"contacts.db"),
            autolad:true
        });
    }
    public listContacts():Promise<IContact[]>{
        return new Promise((inResolve,inReject)=>{
            this.db.find({},
                (inError:Error,inDocs:IContact[])=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve(inDocs);
                    }
                }
            );
        });
    }

    public addContact(inContact: IContact):Promise<IContact>{
        return new Promise((inResolve,inReject)=>{
            this.db.insert(inContact,
                (inError:Error|null,inNewDocs:IContact)=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve(inNewDocs);
                    }
                }
            );
        });
    }
    public deleteContact(inID:string):Promise<string>{
        return new Promise((inResolve,inReject)=>{
            this.db.remove({_id:inID},{},
                (inError:Error|null,inNumRemoved:number)=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve(""+inNumRemoved);
                    }
                }
            );
        });
    }
    public updateContact(inID:number,inName:string,inEmail:string):Promise<number>{
        return new Promise((inResolve,inReject)=>{
            this.db.update({_id:inID},{$set:{name:inName,email:inEmail}},{returnUpdatedDocs:true},
                (inError:Error|null,numberOfUpdated:number,upsert:boolean)=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve(numberOfUpdated);
                    }
                }
            )
        });
    };
}