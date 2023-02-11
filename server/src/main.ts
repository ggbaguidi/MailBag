import path from "path";
import express,
    {Express,NextFunction, Request,Response} from "express";
import {serverInfo} from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import {IContact} from "./contacts";

const app: Express = express();
app.use(express.json());

app.use(
    "/",
    express.static(path.join(__dirname,"../../client/dist"))
);
app.use(function(inRequest: Request,inResponse:Response,inNext: NextFunction){
    inResponse.header("Access-Control-Allow-Origin","*");
    inResponse.header("Access-Control-Allow-Methods",
        "GET, POST,DELETE,OPTIONS"
    );
    inResponse.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type, Accept"
    );
    inNext();
});

//RESTEndpoint: LIST MAILBOXES

app.get("/mailboxes",
    async (inRequest: Request,inResponse: Response) => {
        try{
            const imapWorker: IMAP.Worker =new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            inResponse.json(mailboxes);
        }catch(inError){
            inResponse.send("error");
        }
    }
);

//REST Endpoint: List Messages

app.get("/mailboxes/:mailbox",
    async (inRequest:Request,inResponse:Response)=>{
        try{
            const imapWorker:IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox:inRequest.params.mailbox
            });
            inResponse.json(messages);
        }catch(inError){
            inResponse.send("error");
        }
    }
);

//REST Endpoint: GET a Message

app.get("/messages/:mailbox/:id",
    async (inRequest:Request, inResponse:Response)=>{
        try{
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string|undefined = await imapWorker.getMessageBody({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            inResponse.send(messageBody);
        }catch(inError){
            inResponse.send("error");
        }
    }
)

//REST Endpoint: DELETE a Message
app.delete("/messages/:mailbox/:id",
    async (inRequest:Request,inResponse:Response)=>{
        try{
            const imapWorker:IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id,10)
            });
            inResponse.send("ok");    
        }catch(inError){
            inResponse.send("error")
        }
    }
);

//REST Endpoint: SEND a Message

app.post("/messages",
    async (inRequest:Request,inResponse:Response)=>{
        try{
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(inRequest.body);
            inResponse.send("ok");
        }catch(inError){
            inResponse.send("ok");
        }
    }
);

//REST Endpoint: List COntacts

app.get("/contacts",
    async (inRequest:Request,inResponse:Response)=>{
        try{
            const contactWorker: Contacts.Worker = new Contacts.Worker();
            const contacts:IContact[] = await contactWorker.listContacts();
            inResponse.json(contacts);
        }catch(inError){
            inResponse.send("error");
        }
    }
);

//REST Endpoint: ADD a contact
app.post("/contacts",
    async (inRequest:Request,inResponse:Response)=>{
        try {
            const contactWorker:Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactWorker.addContact(inRequest.body);
            inResponse.json(contact);
        } catch (inError) {
            inResponse.send("error");
        }
    }
);

//REST Endpoint: DELETE a contact
app.delete("/contacts/:id",
    async (inRequest:Request,inResponse:Response)=>{
        try {
            const contactWorker:Contacts.Worker = new  Contacts.Worker();
            await contactWorker.deleteContact(inRequest.params.id);
            inResponse.send("ok");
        } catch (inError) {
            inResponse.send("error");
        }
    }
);

//REST Endpoint: UPDATE a contact

app.put("/contacts/:_id/:newName/:newEmail",
    async (inRequest:Request,inResponse:Response)=>{
        try {
            const contactWorker: Contacts.Worker = new Contacts.Worker();
            await contactWorker.updateContact(parseInt(inRequest.params._id),
                inRequest.params.newName,
                inRequest.params.newEmail,
            );
        inResponse.send("updated");
        } catch (inError) {
            inResponse.send("error");
        }
    }
);
