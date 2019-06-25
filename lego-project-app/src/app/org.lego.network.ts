import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.lego.network{
   export abstract class User extends Participant {
      userEmail: string;
   }
   export class Group extends User {
      groupName: string[];
      groupState: boolean[];
      groupAccount: string[];
   }
   export class GroupPay extends Asset {
      groupName: string;
      pay: number;
      participantNum: number;
      nowPay: number;
      user: SendMoney[];
      minus: MinusMoney[];
      expend: Expenditure[];
   }
   export class SendMoney extends Transaction {
      accountant: Group;
      normal: Group;
      groupPay: GroupPay;
   }
   export class ChangeAccount extends Transaction {
      master: Group;
      user: Group;
      account: string;
      group: string;
   }
   export class AddGroup extends Transaction {
      user: Group;
      group: string;
      account: string;
   }
   export class AccountAgree extends Transaction {
      master: Group;
      user: Group;
      group: string;
   }
   export class RemoveUserGroup extends Transaction {
      user: Group;
      group: string;
   }
   export class MinusMoney extends Transaction {
      user: Group;
      accountant: Group;
      group: GroupPay;
   }
   export class Expenditure extends Transaction {
      accountant: Group;
      groupPay: GroupPay;
      Article: string;
      value: number;
   }
// }
