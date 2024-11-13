import * as Imports from '../../../js/import.js';
const { html, validator, connect } = Imports;

function createModalSettings() {
    return html`
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
                                        <input type="file" rules="required" id ='avatarchange' name = 'avatar' class ='form-control' accept="image/*">
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
                                        <input type="text" rules="required"  name ='name' id="fullnamechangesetting" placeholder="Họ và tên" class ='form-control'>
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
                            <h2 class="auth-form__title">Thay đổi Password</h2>
                            <div class="modal__btnExit">X</div>
                        </div>
                        <div class="auth-form__desc">
                            <p>
                                Thay đổi password của bạn để để đăng nhập an toàn
                            </p>
                        </div>
                        <form id="formChangepassword" action="#" >
                            <div class="auth-form__form">
                                    <div class="form-group">
                                        <input type="password" rules ="required|min:6"  id= 'passwordchange' name = 'password' placeholder="Nhập mật khẩu" class ='form-control'>
                                        <lable class="form-label" for ='password'>Mật khẩu<span class="required">*</span></lable>
                                        <span class="form-message" ></span>
                                    </div>

                                    <div class="form-group">
                                        <input type="password" rules="required|confirmed:password" name="verifypassword" id="verifypasswordchange" placeholder="Nhập lại mật khẩu" class ='form-control'>
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
    onSubmit: async  function (data) {
        if (loadingPage && loadingPage.classList.contains('hidden')) {
            loadingPage.classList.remove('hidden');
        }
        try {
            const response =  await connect()(handleChangeInforUser)({data:{name :data.name}});
            if (response) {
                dispatch("CHANGENAME", data.name);
                Imports.showAlert("Thay đổi Tên thành công!")
            }
        } catch (error) {
            console.error(error);
        } finally {
            requestAnimationFrame(() => {
                if (loadingPage) loadingPage.classList.add('hidden');
            })
        }
    }
}

export const FORMCHANGAVATAROBJECT = {
    form: '#formChangeAvatar',
    onSubmit: async function (data) {
        const file = data.avatar[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    let loadingPage = Imports.$('#loadingPage');
                    if (loadingPage && loadingPage.classList.contains('hidden')) {
                        loadingPage.classList.remove('hidden');
                    }
                    try {
                        const response =  await connect()(handleChangeInforUser)({data:{avatar:e.target.result}});
                        if (response) {
                            dispatch("CHANGEAVATAR", e.target.result);
                            Imports.showAlert("Thay đổi Avatar thành công!")
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        requestAnimationFrame(() => {
                            if (loadingPage) loadingPage.classList.add('hidden');
                        })
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error("Không thể đọc file", error);
            }
        } else {
            console.error('No file selected');
        }
    }
}

export const FORMCHANGEPASSWORD = {
    form: '#formChangepassword',
    onSubmit: async function (data) {
        let loadingPage = Imports.$('#loadingPage');
        if (loadingPage && loadingPage.classList.contains('hidden')) {
            loadingPage.classList.remove('hidden');
        }
        try {
          const response =  await connect()(handleChangeInforUser)({data:{password: data.password}});
            if (response) {
                dispatch("CHANGEPASSWORD", data.password);
                Imports.showAlert("Thay đổi Password thành công!")
            }
        } catch (error) {
            console.error(error);
        } finally {
            requestAnimationFrame(() => {
                if (loadingPage) loadingPage.classList.add('hidden');
            })
        }
    }
}


async function handleChangeInforUser(state) {
    const { PersonInfor, Account , data} = state
    let user = {
        id: "",
        avatar: "",
        name: "",
        email: "",
        jobTitle: "",
        password: "",
    }
    user = Object.keys(user).reduce((acc, key) => {
        if (key in PersonInfor) acc[key] = PersonInfor[key];
        if (key in Account) acc[key] = Account[key];
        return acc;
    }, {});
    for (let key in data) {
        user[key] = data[key];
    }
    let promise
    try {
        const response = await window.API.changeInfor(user);
        if (response?.success) {
            
            return true;
        } else {
            throw new Error(response?.message || "Lỗi trong quá trình thực hiện!");
        }
    } catch (error) {
        Imports.showAlert(error.message,"Error");
        return false;
    }
}