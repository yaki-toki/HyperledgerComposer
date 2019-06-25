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
import { GroupService } from './Group.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-group',
  templateUrl: './Group.component.html',
  styleUrls: ['./Group.component.css'],
  providers: [GroupService]
})
export class GroupComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  groupName = new FormControl('', Validators.required);
  groupState = new FormControl('', Validators.required);
  groupAccount = new FormControl('', Validators.required);
  userEmail = new FormControl('', Validators.required);


  constructor(public serviceGroup: GroupService, fb: FormBuilder) {
    this.myForm = fb.group({
      groupName: this.groupName,
      groupState: this.groupState,
      groupAccount: this.groupAccount,
      userEmail: this.userEmail
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceGroup.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.lego.network.Group',
      'groupName': this.groupName.value,
      'groupState': this.groupState.value,
      'groupAccount': this.groupAccount.value,
      'userEmail': this.userEmail.value
    };

    this.myForm.setValue({
      'groupName': null,
      'groupState': null,
      'groupAccount': null,
      'userEmail': null
    });

    return this.serviceGroup.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'groupName': null,
        'groupState': null,
        'groupAccount': null,
        'userEmail': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.lego.network.Group',
      'groupName': this.groupName.value,
      'groupState': this.groupState.value,
      'groupAccount': this.groupAccount.value,
    };

    return this.serviceGroup.updateParticipant(form.get('userEmail').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceGroup.deleteParticipant(this.currentId)
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

    return this.serviceGroup.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'groupName': null,
        'groupState': null,
        'groupAccount': null,
        'userEmail': null
      };

      if (result.groupName) {
        formObject.groupName = result.groupName;
      } else {
        formObject.groupName = null;
      }

      if (result.groupState) {
        formObject.groupState = result.groupState;
      } else {
        formObject.groupState = null;
      }

      if (result.groupAccount) {
        formObject.groupAccount = result.groupAccount;
      } else {
        formObject.groupAccount = null;
      }

      if (result.userEmail) {
        formObject.userEmail = result.userEmail;
      } else {
        formObject.userEmail = null;
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
      'groupState': null,
      'groupAccount': null,
      'userEmail': null
    });
  }
}
