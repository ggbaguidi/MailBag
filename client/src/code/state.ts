import React from "react";
import * as Contacts from './Contacts'
import * as IMAP from './IMAP'


let stateSingleton: any = null;

export function createState(inParentComponent: React.Component): any{
    if (stateSingleton == null) {
        stateSingleton = {
            pleaseWaitVisible: false,
            contacts: [],
            mailboxes: [],
            messages: [],
            currentView: "welcome",
            currentMailbox: null,
            messageID: null,
            messageDate: null,
            messageFrom: null,
            messageTo: null,
            messageSubject: null,
            messageBody: null,
            contactID: null,
            contactName: null,
            constactEmail: null,
            showHidePleaseWait: function(inVisible: boolean): void {
                this.setState(()=>({
                    pleaseWaitVisible: inVisible
                }));
            }.bind(inParentComponent),
            addMailboxToList : function(inMailbox:
                IMAP.IMailbox): void {
                this.setState(prevState => ({ mailboxes : [
                ...prevState.mailboxes, inMailbox ] 
                }));
            }.bind(inParentComponent),
            addContactToList : function(inContact:
                Contacts.IContact): void {
                this.setState(prevState => ({ contacts : [
                ...prevState.contacts, inContact ] 
                }));
            }.bind(inParentComponent)
        }
    }
}

export function getState(): any{
    
    return stateSingleton;
}/* End getState(). */