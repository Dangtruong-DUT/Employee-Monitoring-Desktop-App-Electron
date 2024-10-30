import * as Imports from '../../../js/import.js';
const { html } = Imports;

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
                        <div class="auth-form__form">
                            <form id="formChangeAvatar">
                                <div class="form-group">
                                    <lable class="form-label" style="display: block; " for='avatar'>Ảnh đại diện<span class="required">*</span></lable>
                                    <input type="file"  id ='avatar' name = 'avatar' class ='form-control' accept=".jpg, .jpeg, .png">
                                    <span class="form-message"></span>
                                </div>    
                            </form>
                        </div>
                        <div class="auth-form__controls">
                            <button class="btn btn--modalbtnext  modal__btnExit">Hủy</button>
                            <button type="submit" class="btn btn--primary btn--normal" value="Xác nhận">Xác nhận</button>
                        </div>
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
                        <div class="auth-form__form">
                            <form id="formChangeName">
                                <div class="form-group">
                                    <input type="text" name ='fullname' id="fullname" placeholder="Họ và tên" class ='form-control'>
                                    <lable class="form-label" for ='fullname'>Họ và tên<span class="required">*</span></lable>
                                    <span class="form-message"></span>
                                </div>   
                            </form>
                        </div>
                        <div class="auth-form__controls">
                            <button class="btn btn--modalbtnext  modal__btnExit">Hủy</button>
                            <button type="submit" class="btn btn--primary btn--normal" value="Xác nhận">Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--/. End modal đổi tên 1-->
    `
}
export default createModalSettings