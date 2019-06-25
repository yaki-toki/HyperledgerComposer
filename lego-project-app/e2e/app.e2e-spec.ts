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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for lego-project-app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be lego-project-app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('lego-project-app');
    })
  });

  it('network-name should be lego4-network@0.3.3',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('lego4-network@0.3.3.bna');
    });
  });

  it('navbar-brand should be lego-project-app',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('lego-project-app');
    });
  });

  
    it('GroupPay component should be loadable',() => {
      page.navigateTo('/GroupPay');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('GroupPay');
      });
    });

    it('GroupPay table should have 8 columns',() => {
      page.navigateTo('/GroupPay');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Group component should be loadable',() => {
      page.navigateTo('/Group');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Group');
      });
    });

    it('Group table should have 5 columns',() => {
      page.navigateTo('/Group');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('SendMoney component should be loadable',() => {
      page.navigateTo('/SendMoney');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SendMoney');
      });
    });
  
    it('ChangeAccount component should be loadable',() => {
      page.navigateTo('/ChangeAccount');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ChangeAccount');
      });
    });
  
    it('AddGroup component should be loadable',() => {
      page.navigateTo('/AddGroup');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('AddGroup');
      });
    });
  
    it('AccountAgree component should be loadable',() => {
      page.navigateTo('/AccountAgree');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('AccountAgree');
      });
    });
  
    it('RemoveUserGroup component should be loadable',() => {
      page.navigateTo('/RemoveUserGroup');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('RemoveUserGroup');
      });
    });
  
    it('MinusMoney component should be loadable',() => {
      page.navigateTo('/MinusMoney');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('MinusMoney');
      });
    });
  
    it('Expenditure component should be loadable',() => {
      page.navigateTo('/Expenditure');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Expenditure');
      });
    });
  

});