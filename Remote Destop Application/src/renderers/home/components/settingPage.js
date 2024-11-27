import * as Imports from '../../../js/import.js';
const {connect, html,$ } = Imports;

function settingPage({PersonInfor}) {
    return html`
                    <div class="setting__main  ">
                        <!--group setting row có class enableSettingInfor với data-index tương ứng với dataindex modal thì chỉnh sửa được còn block roài thì không được-->
                        <section class="container-groupSetting">
                            <div class="group-setting__header">

                                <div class="setting__item-left">
                                    <div class="setting__item-container">
                                        <img class= 'setting__img' src="../src/assets/imgs/settingAccount.png"  alt="settingAccount">
                                    </div>
                                    <div class="setting__item-container">
                                        <div class="setting-item__title">Account</div>
                                        <div class="setting-item__decs">Thiết lập các thông tin tài khoản cơ bản của bạn tại đây</div>
                                    </div>
                                </div>
                                <div class="setting__item-rigth">
                                    <div class="setting-item__value"></div>
                                </div>
                               
                            </div>
                            <div class="group-setting__row group-setting__row--block tooltip">
                                 <div class="setting__item-left">
                                    <div class="setting__item-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon--fillNone icon--normal" viewBox="0 0 24 24"><g  stroke-width="1.5"><circle cx="9" cy="9" r="2"/><path d="M13 15c0 1.105 0 2-4 2s-4-.895-4-2s1.79-2 4-2s4 .895 4 2Z"/><path stroke-linecap="round" d="M22 12c0 3.771 0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12s0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172c.47.47.751 1.054.92 1.828M19 12h-4m4-3h-5m5 6h-3"/></g></svg>
                                    </div>
                                    <div class="setting__item-container">
                                        <div class="setting-item__title">Mã nhân viên</div>
                                        <div class="setting-item__decs">Mã định danh tài khoản của bạn tại công ty</div>
                                    </div>
                                </div>
                                <div class="setting__item-rigth ">
                                    <a class="setting-item__value group-setting__row--block">${PersonInfor.id}</a>
                                </div>
                                <div class="tooltiptext ">Trường này không được chỉnh sửa</div>
                            </div>

                            <div class="group-setting__row enableSettingInfor" data-indexSettingChange="0">
                                <div class="setting__item-left">
                                    <div class="setting__item-container">
                                        <svg class="icon icon--fillNone icon--normal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g   stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#e8e8e8"><path d="M7.783 17.111c-1.1.632-3.986 1.922-2.229 3.536C6.413 21.436 7.37 22 8.571 22h6.858c1.202 0 2.158-.564 3.017-1.353c1.757-1.614-1.128-2.904-2.229-3.536c-2.58-1.481-5.854-1.481-8.434 0M15.5 10a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0"/><path d="M2.854 16A9.9 9.9 0 0 1 2 11.965C2 6.46 6.477 2 12 2s10 4.461 10 9.965A9.9 9.9 0 0 1 21.146 16"/></g></svg>
                                    </div>
                                    <div class="setting__item-container">
                                        <div class="setting-item__title">Ảnh đại diện</div>
                                        <div class="setting-item__decs">Ảnh đại diện giúp các thành viên khác giễ dàng nhận ra bạn</div>
                                    </div>
                                </div>
                                <div class="setting__item-rigth">
                                    <a class="setting-item__value">Thay đổi</a>
                                </div>
                            </div>
                            <div class="group-setting__row enableSettingInfor " data-indexSettingChange="1">
                                <div class="setting__item-left">
                                    <div class="setting__item-container">
                                        <svg class="icon icon--fillNone icon--normal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g   stroke-width="1.5"><path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9"/><path stroke-linecap="round" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2"/></g></svg>
                                    </div>
                                    <div class="setting__item-container">
                                        <div class="setting-item__title">Họ và Tên</div>
                                        <div class="setting-item__decs">Chọn tên của bạn và hiện thị với mọi người</div>
                                    </div>
                                </div>
                                <div class="setting__item-rigth">
                                    <a class="setting-item__value">${PersonInfor.name}</a>
                                </div>
                            </div>
                            <div class="group-setting__row enableSettingInfor " data-indexSettingChange="2">
                                <div class="setting__item-left">
                                    <div class="setting__item-container">
                                        <svg class="icon icon--fillNone icon--normal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g   stroke-width="1.5"><g  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#e8e8e8"><path d="M13.993 15H14m-4 0h.007M5 15a7 7 0 1 1 14 0a7 7 0 0 1-14 0"/><path d="M16.5 9.5v-3a4.5 4.5 0 1 0-9 0v3"/></g></svg>
                                    </div>
                                    <div class="setting__item-container">
                                        <div class="setting-item__title">Password</div>
                                        <div class="setting-item__decs">Đổi password để giễ giàng quản lý</div>
                                    </div>
                                </div>
                                <div class="setting__item-rigth">
                                    <a class="setting-item__value">********</a>
                                </div>
                            </div>
                            <div class="group-setting__row group-setting__row--block tooltip">
                                <div class="setting__item-left">
                                    <div class="setting__item-container">
                                        <svg class="icon icon--fillNone icon--normal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#e8e8e8"><path d="m2 6l6.913 3.917c2.549 1.444 3.625 1.444 6.174 0L22 6"/><path d="M2.016 13.476c.065 3.065.098 4.598 1.229 5.733c1.131 1.136 2.705 1.175 5.854 1.254c1.94.05 3.862.05 5.802 0c3.149-.079 4.723-.118 5.854-1.254c1.131-1.135 1.164-2.668 1.23-5.733c.02-.986.02-1.966 0-2.952c-.066-3.065-.099-4.598-1.23-5.733c-1.131-1.136-2.705-1.175-5.854-1.254a115 115 0 0 0-5.802 0c-3.149.079-4.723.118-5.854 1.254c-1.131 1.135-1.164 2.668-1.23 5.733a69 69 0 0 0 0 2.952"/></g></svg>
                                    </div>
                                    <div class="setting__item-container">
                                        <div class="setting-item__title">Email</div>
                                        <div class="setting-item__decs">Địa chỉ email liên hệ</div>
                                    </div>
                                </div>
                                <div class="setting__item-rigth ">
                                    <a class="setting-item__value group-setting__row--block">${PersonInfor.email}</a>
                                </div>
                                <div class="tooltiptext ">Trường này không được chỉnh sửa</div>
                            </div>
                        </section>
                    </div>
    `
}
export default connect()(settingPage) 

export const settingPageEvents = function(e) {
    //event exit Department
    const btnChangeInfor = e.target.closest('.enableSettingInfor');
    if (btnChangeInfor) {
        let indexSettingChange = btnChangeInfor.dataset.indexsettingchange;
        let modalSetting = $(`.modalSettingAccount[data-indexSettingChange="${indexSettingChange}"]`);
        if (modalSetting.classList.contains('hidden')) {
            modalSetting.classList.remove('hidden');
        }
    }
}