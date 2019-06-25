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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GroupPayService } from './GroupPay.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-grouppay',
  templateUrl: './GroupPay.component.html',
  styleUrls: ['./GroupPay.component.css'],
  providers: [GroupPayService]
})
export class GroupPayComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  groupName = new FormControl('', Validators.required);
  pay = new FormControl('', Validators.required);
  participantNum = new FormControl('', Validators.required);
  nowPay = new FormControl('', Validators.required);
  user = new FormControl('', Validators.required);
  minus = new FormControl('', Validators.required);
  expend = new FormControl('', Validators.required);

  constructor(public serviceGroupPay: GroupPayService, fb: FormBuilder) {
    this.myForm = fb.group({
      groupName: this.groupName,
      pay: this.pay,
      participantNum: this.participantNum,
      nowPay: this.nowPay,
      user: this.user,
      minus: this.minus,
      expend: this.expend
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceGroupPay.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.lego.network.GroupPay',
      'groupName': this.groupName.value,
      'pay': this.pay.value,
      'participantNum': this.participantNum.value,
      'nowPay': this.nowPay.value,
      'user': this.user.value,
      'minus': this.minus.value,
      'expend': this.expend.value
    };

    this.myForm.setValue({
      'groupName': null,
      'pay': null,
      'participantNum': null,
      'nowPay': null,
      'user': null,
      'minus': null,
      'expend': null
    });

    return this.serviceGroupPay.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'groupName': null,
        'pay': null,
        'participantNum': null,
        'nowPay': null,
        'user': null,
        'minus': null,
        'expend': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.lego.network.GroupPay',
      'pay': this.pay.value,
      'participantNum': this.participantNum.value,
      'nowPay': this.nowPay.value,
      'user': this.user.value,
      'minus': this.minus.value,
      'expend': this.expend.value
    };

    return this.serviceGroupPay.updateAsset(form.get('groupName').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceGroupPay.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceGroupPay.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'groupName': null,
        'pay': null,
        'participantNum': null,
        'nowPay': null,
        'user': null,
        'minus': null,
        'expend': null
      };

      if (result.groupName) {
        formObject.groupName = result.groupName;
      } else {
        formObject.groupName = null;
      }

      if (result.pay) {
        formObject.pay = result.pay;
      } else {
        formObject.pay = null;
      }

      if (result.participantNum) {
        formObject.participantNum = result.participantNum;
      } else {
        formObject.participantNum = null;
      }

      if (result.nowPay) {
        formObject.nowPay = result.nowPay;
      } else {
        formObject.nowPay = null;
      }

      if (result.user) {
        formObject.user = result.user;
      } else {
        formObject.user = null;
      }

      if (result.minus) {
        formObject.minus = result.minus;
      } else {
        formObject.minus = null;
      }

      if (result.expend) {
        formObject.expend = result.expend;
      } else {
        formObject.expend = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'groupName': null,
      'pay': null,
      'participantNum': null,
      'nowPay': null,
      'user': null,
      'minus': null,
      'expend': null
      });
  }

}
