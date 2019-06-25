/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { GroupPayComponent } from './GroupPay/GroupPay.component';

import { GroupComponent } from './Group/Group.component';

import { SendMoneyComponent } from './SendMoney/SendMoney.component';
import { ChangeAccountComponent } from './ChangeAccount/ChangeAccount.component';
import { AddGroupComponent } from './AddGroup/AddGroup.component';
import { AccountAgreeComponent } from './AccountAgree/AccountAgree.component';
import { RemoveUserGroupComponent } from './RemoveUserGroup/RemoveUserGroup.component';
import { MinusMoneyComponent } from './MinusMoney/MinusMoney.component';
import { ExpenditureComponent } from './Expenditure/Expenditure.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'GroupPay', component: GroupPayComponent },
  { path: 'Group', component: GroupComponent },
  { path: 'SendMoney', component: SendMoneyComponent },
  { path: 'ChangeAccount', component: ChangeAccountComponent },
  { path: 'AddGroup', component: AddGroupComponent },
  { path: 'AccountAgree', component: AccountAgreeComponent },
  { path: 'RemoveUserGroup', component: RemoveUserGroupComponent },
  { path: 'MinusMoney', component: MinusMoneyComponent },
  { path: 'Expenditure', component: ExpenditureComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
