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

/**
 * 
 * @param {org.lego.network.MinusMoney} minusMoney
 * @transaction 
 */
async function minusMoney(tx){

    // 회비를 돌려받는 사용자
    const user = tx.user;
    // 회비를 돌려주는 회계
    const accountant = tx.accountant;
    // 회비가 거래되는 그룹 정보
    const group = tx.group;

    // 회비를 납부할 그룹의 이름
    const allGroupName = group.groupName.toString();

    // 납부자 그룹 정보 유효성 검사
    var state1 = false;
    var groupNumber1 = 0;
    for (var i = 0; i < user.groupName.length; i++) {
        if (user.groupName[i] == allGroupName) {
            state1 = true;
            groupNumber1 = i;
        }
    }

    // 회계 그룹 정보 유효성 검사
    var state2 = false;
    var groupNumber2 = 0;
    for (var i = 0; i < accountant.groupName.length; i++) {
        if (accountant.groupName[i] == allGroupName) {
            state2 = true;
            groupNumber2 = i;
        }
    }

    // 납부자, 회계, 그룹 이름 일치 확인
    if (state1 && state2) {
        // 사용자들이 인증이 된 회원 인지 확인
        if (user.groupState[groupNumber1] && accountant.groupState[groupNumber2]) {
            // 회계로 입력된 사용자의 유형이 회계인지 확인
            if (accountant.groupAccount[groupNumber2] == "accountant") {
                // 돈을 돌려주었기에 전체 납부된 금액에서 차감
                group.nowPay -= group.pay;
                // 환급되는 정보 저장
                if (group.minus) {
                    group.minus.push(tx);
                } else {
                    group.minus = [tx];
                }

                // registroy에 저장된 Asset정보 선언
                const assetRegistry = await getAssetRegistry('org.lego.network.GroupPay');
                // Asset정보 업데이트
                await assetRegistry.update(tx.group);

                // 납부가 완료되면 "Success"를 반환
                return 1003;
            }
            // 회계로 입력된 사용자의 권한이 "accountant"가 아닌 경우
            return 1002;
        }
        // 입력된 사용자들이 인증이 된 회원이 아닌 경우
        return 1001;
    }
    // 회비를 돌려주는 인원들의 그룹 정보가 불일치 하는 경우
    return 1000;
}

/**
 * @param {org.lego.network.SendMoney} sendMoney
 * @transaction
 */
async function sendMoney(tx) {
    // 일반 사용자 정보 선언
    const normal = tx.normal;
    // 회계 사용자 정보 선언
    const accountant = tx.accountant;
    // 회비 납부 그룹 정보 선언
    const groupPay = tx.groupPay;

    // 회비를 납부할 그룹의 이름
    const allGroupName = groupPay.groupName.toString();

    // 납부자 그룹 정보 유효성 검사
    var state1 = false;
    var groupNumber1 = 0;
    for (var i = 0; i < normal.groupName.length; i++) {
        if (normal.groupName[i] == allGroupName) {
            state1 = true;
            groupNumber1 = i;
        }
    }

    // 회계 그룹 정보 유효성 검사
    var state2 = false;
    var groupNumber = 0;
    for (var i = 0; i < accountant.groupName.length; i++) {
        if (accountant.groupName[i] == allGroupName) {
            state2 = true;
            groupNumber = i;
        }
    }

    // 납부자, 회계, 그룹 이름 일치 확인
    if (state1 && state2) {
        if (normal.groupState[groupNumber1] && accountant.groupState[groupNumber]) {
            // 회계로 입력된 사용자의 유형이 회계인지 확인
            if (accountant.groupAccount[groupNumber] == "accountant") {
                // 그룹 정보에 납부자 수를 1증가
                groupPay.participantNum += 1;
                // 그룹 정보에 현제 납부 된 회비 금액을 증가
                groupPay.nowPay += groupPay.pay;
                // 납부자 정보 저장
                if (groupPay.user) {
                    groupPay.user.push(tx);
                } else {
                    groupPay.user = [tx];
                }

                // registroy에 저장된 Asset정보 선언
                const assetRegistry = await getAssetRegistry('org.lego.network.GroupPay');
                // Asset정보 업데이트
                await assetRegistry.update(tx.groupPay);

                // 납부가 완료되면 "Success"를 반환
                return 900;
            }
            // 입력된 회계의 유형이 회계가 아닌 경우 반환
            return 901;
        }
        return 902;
    }
    // 그룹의 이름이 일치하지 않는 경우
    return 903;
}

// 사용자 권한 변경
/**
 * @param {org.lego.network.ChangeAccount} changeAccount
 * @transaction
 */
async function changeAccount(tx) {
    const master = tx.master;
    const user = tx.user;
    const account = tx.account;
    const group = tx.group;

    // 사용자 그룹 정보 유효성 검사
    var state = false;
    var groupNumber = 0;
    for (var i = 0; i < user.groupName.length; i++) {
        if (user.groupName[i] == group) {
            state = true;
            groupNumber = i;
            break;
        }
    }

    // 마스터 그룹 정보 유효성 검사
    var masterState = false;
    var masterNumber = 0;
    for(var i = 0; i < master.groupName.length; i++){
        if(master.groupName[i] == group){
            masterState = true;
            masterNumber = i;
            break;
        }
    }

    if(state && masterState){
        if(master.groupAccount[masterNumber] == "master"){
            if(user.groupAccount[groupNumber] == "master"){
                // 권한이 "master"인 사람이 본인의 권한을 변경하려는 시도를 하는 경우
                return 803;
            }else{
                user.groupAccount[groupNumber] = account;
                if(account == "master"){
                    user.groupState[groupNumber] = true;
                }
                const participantRegistry = await getParticipantRegistry('org.lego.network.Group');
                await participantRegistry.update(tx.user);
                // 권한 변경이 완료 된 상태
                return 800;
            }
        }
        // 권한 변경을 시도하는 사용자(마스터)의 권한이 "master"가 아닌 경우
        return 801;
    }
    // 권한을 변경하는 사용자와 마스터의 그룹이 일치하지 않는 경우
    return 802;
}

// 사용자의 소속 그룹 정보 추가
/**
 * @param {org.lego.network.AddGroup} addGroup
 * @transaction
 */
async function addGroup(tx) {
    const user = tx.user;
    const group = tx.group;
    // optional한 정보
    // 입력되는 경우는 Web상에서 등록 할 것임
    const account = tx.account.toString();

    // 계정의 권한 등급
    var acc = "normal";
    var status = false;
    
    // Web상에서 입력된 권한이 "master"인 경우
    // (그룹을 스스로 만드는 사람에게만 허용)
    if(account == "master"){
        // 권한 등급을 "master"로 설정
        acc = "master";
        // "master"권한인 경우 인증 상태를 true로 변경
        status = true;
    }

    // 그룹의 이름이 지정되지 않은 경우
    if(group.length == 0){
        // 702번 코드를 응답
        return 702;
    }

    // 이미 등록된 그룹인지 인증하는 부분
    var state = false;
    for (var i = 0; i < user.groupName.length; i++) {
        if (user.groupName[i] == group) {
            state = true;
        }
    }

    // 입력한 그룹이 이미 등록이 되어있는 경우
    if(state){
        // 701번 코드로 응답
        return 701;
    }else{
        // 처음 추가하는 그룹인 경우
        if (user.groupName) {
            user.groupName.push(group);
            user.groupState.push(status);
            user.groupAccount.push(acc);
        } else {
            user.groupName = [group];
            user.groupState = [status];
            user.groupAccount = [acc];
        }
        // 위에서 변경한 정보를 반환하기 위한 Registroy 받아오기
        const participantRegistry = await getParticipantRegistry('org.lego.network.Group');
        // 변경된 정보로 업데이트
        await participantRegistry.update(tx.user);
        // 업데이트 완료시 700번 코드로 응답
        return 700;
    }
}

/**
 * @param {org.lego.network.AccountAgree} accountAgree
 * @transaction
 * 사용자 인증 등록을 하는 트랜잭션
 */
async function accountAgree(tx){
    const master = tx.master;
    const user = tx.user;
    const group = tx.group;

    // 마스터 사용자 정보 검색
    var masterState = false;
    var masterNumber = 0;
    for(var i = 0; i < master.groupName.length; i++){
        if(master.groupName[i] == group){
            masterState = true;
            masterNumber = i;
        }
    }

    // 일반 사용자 정보 검색
    var userState = false;
    var userNumber = 0;
    for (var i = 0; i < user.groupName.length; i++) {
        if (user.groupName[i] == group) {
            userState = true;
            userNumber = i;
        }
    }

    if(masterState && userState){

        if(master.groupAccount[masterNumber] == "master"){
            if(!user.groupState[userNumber]){
                // 사용자 인증 허용
                user.groupState[userNumber] = true;
                // 위에서 변경한 정보를 반환하기 위한 Registroy 받아오기
                const participantRegistry = await getParticipantRegistry('org.lego.network.Group');
                // 변경된 정보로 업데이트
                await participantRegistry.update(tx.user);
                // 인증 허용이 완료되면 600번 코드로 응답
                return 600;
            }
            // 이미 인증이 완료된 회원
            return 601;
        }
        // 인증을 허용하는 마스터 사용자의 권한 등급이 "master"이 아닌 경우
        return 602;
    }
    // 마스터, 일반 사용자들의 그룹이 일치하지 않는 경우
    return 603;
}

/**
 * @param {org.lego.network.Expenditure} expenditure 
 * @transaction
 */
async function expenditure(tx){
    const accountant = tx.accountant;
    const groupPay = tx.groupPay;
    const article = tx.Article;
    const value = tx.value;

    // 회비를 납부할 그룹의 이름
    const allGroupName = groupPay.groupName.toString();

    // 일반 사용자 정보 검색
    var accountantState = false;
    var accountantNumber = 0;
    for (var i = 0; i < accountant.groupName.length; i++) {
        if (accountant.groupName[i] == allGroupName) {
            accountantState = true;
            accountantNumber = i;
        }
    }

    if(accountant.groupAccount[accountantNumber] == 'accountant'){
        if(accountantState){
            groupPay.nowPay -= value;
            // 납부자 정보 저장
            if (groupPay.expend) {
                groupPay.expend.push(tx);
            } else {
                groupPay.expend = [tx];
            }

            // registroy에 저장된 Asset정보 선언
            const assetRegistry = await getAssetRegistry('org.lego.network.GroupPay');
            // Asset정보 업데이트
            await assetRegistry.update(tx.groupPay);

            // 납부가 완료되면 "Success"를 반환
            return 2000;
        }
        return 2001;
    }
    return 2002;
}
/**
 * @param {org.lego.network.RemoveUserGroup} removeUserGroup
 * @transaction
 * 특정 그룹 정보를 제거하는 트랜잭션
 */
async function removeUserGroup(tx){
    const user = tx.user;
    const group = tx.group;

    if(user.groupName.length == 0){
        // 사용자가 등록된 그룹이 없을 경우 501코드 응답
        return 501;
    }

    // 일반 사용자 정보 검색
    var userNumber = 0;
    for (var i = 0; i < user.groupName.length; i++) {
        if (user.groupName[i] == group) {
            userNumber = i;
        }
    }

    if(user.groupAccount[userNumber] == "master"){
        // "master"는 그룹을 탈퇴할 수 없음
        return 503;
    }

    for(var i = 0; i < user.groupName.length; i++){
        if(user.groupName[i] == group){
            user.groupName.splice(i, 1);
            user.groupState.splice(i, 1);
            user.groupAccount.splice(i, 1);

            // 위에서 변경한 정보를 반환하기 위한 Registroy 받아오기
            const participantRegistry = await getParticipantRegistry('org.lego.network.Group');
            // 변경된 정보로 업데이트
            await participantRegistry.update(tx.user);
            // 인증 허용이 완료되면 500 코드로 응답
            return 500;
        }
    }

    // 제거를 요청한 그룹이 없는 경우 502 코드로 응답
    return 502;
}