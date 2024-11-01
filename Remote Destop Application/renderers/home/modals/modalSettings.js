import * as Imports from '../../../js/import.js';
const { html,validator } = Imports;

function createModalSettings(){
    return html `
            <!--modal ảnh đại diện-->
            <div data-indexSettingChange="0" class="modal hidden  modalSettingAccount">
                <div class="modal__overlay"></div>
                <div class="modal__body">
                    <div class="auth-form">
                        <div class="auth-form__header">
                            <h2 class="auth-form__title">Chọn ảnh đại diện mới</h2>
                            <div class="modal__btnExit">X</div>
                        </div>
                        <div class="auth-form__desc">
                            <p>
                                Chọn ảnh đại diện mới để thay đổi hình ảnh đại diện của bạn
                            </p>
                        </div>
                        <form id="formChangeAvatar">
                            <div class="auth-form__form">
                                    <div class="form-group">
                                        <input type="file"  id ='avatarchange' name = 'avatar' class ='form-control' accept=".jpg, .jpeg, .png">
                                        <lable class="form-label" style="display: block; " for='avatar'>Ảnh đại diện<span class="required">*</span></lable>
                                        <span class="form-message"></span>
                                    </div>    
                            </div>
                            <div class="auth-form__controls">
                                <button class="btn btn--modalbtnext  modal__btnExit">Hủy</button>
                                <button type="submit" class="btn btn--primary btn--normal" value="Xác nhận">Xác nhận</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!--/. End modal change avatar 0-->

            <!--modal change name-->
            <div data-indexSettingChange="1" class="modal hidden  modalSettingAccount">
                <div class="modal__overlay"></div>
                <div class="modal__body">
                    <div class="auth-form">
                        <div class="auth-form__header">
                            <h2 class="auth-form__title">Thay đổi họ và tên</h2>
                            <div class="modal__btnExit">X</div>
                        </div>
                        <div class="auth-form__desc">
                            <p>
                                Thay đổi họ và tên của bạn để hiện thị với các kết nối
                            </p>
                        </div>
                        <form id="formChangeName"  action="#">
                            <div class="auth-form__form">
                                    <div class="form-group">
                                        <input type="text" name ='name' id="fullnamechangesetting" placeholder="Họ và tên" class ='form-control'>
                                        <lable class="form-label" for ='fullname'>Họ và tên<span class="required">*</span></lable>
                                        <span class="form-message"></span>
                                    </div>   
                                    </div>
                                    <div class="auth-form__controls">
                                        <button class="btn btn--modalbtnext  modal__btnExit">Hủy</button>
                                        <button type ="submit"  class="btn btn--primary btn--normal" value="Xác nhận">Xác nhận</button>
                                    </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!--/. End modal đổi tên 1-->

            <!--modal change password-->
            <div data-indexSettingChange="2" class="modal hidden  modalSettingAccount">
                <div class="modal__overlay"></div>
                <div class="modal__body">
                    <div class="auth-form">
                        <div class="auth-form__header">
                            <h2 class="auth-form__title">Thay đổi họ và tên</h2>
                            <div class="modal__btnExit">X</div>
                        </div>
                        <div class="auth-form__desc">
                            <p>
                                Thay đổi họ và tên của bạn để hiện thị với các kết nối
                            </p>
                        </div>
                        <form id="formChangepassword" action="#" >
                            <div class="auth-form__form">
                                    <div class="form-group">
                                        <input type="password"id= 'passwordchange' name = 'password' placeholder="Nhập mật khẩu" class ='form-control'>
                                        <lable class="form-label" for ='password'>Mật khẩu<span class="required">*</span></lable>
                                        <span class="form-message" ></span>
                                    </div>

                                    <div class="form-group">
                                        <input type="password" name="verifypassword" id="verifypasswordchange" placeholder="Nhập lại mật khẩu" class ='form-control'>
                                        <lable class="form-label">Nhập lại mật khẩu<span class="required">*</span></lable>
                                        <span class="form-message"></span>
                                    </div> 
                            </div>
                            <div class="auth-form__controls">
                                <button class="btn btn--modalbtnext  modal__btnExit">Hủy</button>
                                <button type="submit" class="btn btn--primary btn--normal" value="Xác nhận">Xác nhận</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!--/. End modal đổi password-->
    `
}

export default createModalSettings
export const FORMCHANGENAMEOBJECT = {
    form: '#formChangeName',
        formGroupSelector: '.form-group',
        errorSelector: '.form-message',
        rules: [
            validator.isRequired('#fullnamechangesetting'),
        ],
        onSubmit: async function (data) {
            dispatch("CHANGENAME", data.name);
            validaterForms(2);

        }
}
export const FORMCHANGAVATAROBJECT = {
    form: '#formChangeAvatar',
        formGroupSelector: '.form-group',
        errorSelector: '.form-message',
        rules: [
            validator.isRequired('#avatarchange'),
        ],
        onSubmit: async function (data) {
            dispatch("CHANGEAVATAR", data.avatar);
            validaterForms(2);

        }
}
export const FORMCHANGEPASSWORD = {
    form: '#formChangepassword',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        validator.minLegth('#passwordchange',6),
        validator.isRequired('#verifypasswordchange'),
        validator.isConfirmed('#verifypasswordchange',function () {
            return document.querySelector('#formChangepassword #passwordchange').value
        },'Mật khẩu không trùng khớp'),
    ],
    onSubmit: function (data) {
        console.log(data);
        dispatch("CHANGEPASSWORD", data.password);
        validaterForms(2);
    }
}