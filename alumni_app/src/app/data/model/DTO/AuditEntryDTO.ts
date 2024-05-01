export class AuditEntryDTO {
    id?: number;
    'timeStamp': Date;
    'actionType': string;
    'userId': number;
    'resourceName': string;
    'actionDetails': string;
    'oldValue': string;
    'newValue': string;
}