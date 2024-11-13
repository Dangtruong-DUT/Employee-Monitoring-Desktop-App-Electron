import * as Imports from '../../../js/import.js';
const { connect, html } = Imports;
import Validator from '../../../utils/validator.js';
function createModalHomePage({ Departments }) {
    return html`
         <!--modal join session-->
            <div id="modal_JoinSession" class="modal hidden">
                <div class="modal__overlay"></div>
                <div class="modal__body">
                    <div class="auth-form">
                        <div class="auth-form__header">
                            <h2 class="auth-form__title">Tham gia vào phòng ban</h2>
                            <div class="modal__btnExit">X</div>
                        </div>
                        <!--Nếu đã tham gia vào company nào hiện form này-->
                        <div class="auth-form__body">
                            <div class="auth-form__desc">
                                <p>
                                    Nhập mã phòng ban do bộ phận IT cung cấp để cấp cho họ quyền truy cập vào thiết bị của bạn và
                                    bắt
                                    đầu nhận hỗ trợ.
                                </p>
                            </div>
                            <form id='formJoinDerpart'>
                                <div class="auth-form__form">
                                        <div class="form-group">
                                            <input type="text" rules="required" id='maPB' name='maPB' class='form-control' placeholder="Mã phòng ban">
                                            <lable class="form-label" for='maPB'>Mã phòng ban<span class="required">*</span></lable>
                                            <span class="form-message"></span>
                                        </div>

                                </div>
                                <div class="auth-form__controls">
                                    <button type="submit" class="btn btn--primary btn--normal">Connect</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <!--/. End modal join session-->

             <!--modal exit session -->
                    ${Departments.map((department) => {
        return html`
                                <div data-indexSession="${department?.id}" class="modal hidden modalexitSession">
                                    <div class="modal__overlay"></div>
                                    <div class="modal__body">
                                        <div class="auth-form">
                                            <div class="auth-form__header">
                                                <h2 class="auth-form__title">${department?.isJoined && 'Thoát Phòng ban' || 'Hủy yêu cầu tham gia'}</h2>
                                                <div class="modal__btnExit">X</div>
                                            </div>
                                            <div class="auth-form__desc">
                                                <p>
                                                    Yêu cầu của bạn sẽ được xem xét và xét duyệt bởi Admin
                                                </p>
                                            </div>
                                            <div class="auth-form__form">

                                                <div class="modal-body__title--warning">${department?.isJoined && `Bạn chắc chắn muốn thoát phòng ${department?.name} !` || `Bạn chắc chắn muốn hủy yêu cầu tham gia phòng ${department?.name} !`}</div>

                                            </div>
                                            <div class="auth-form__controls">
                                                <button class="btn btn--modalbtnext  modal__btnExit">Cancel</button>
                                                <button type="submit" class="btn btn--primary btn--normal btnAcceptDeleteDepart">Accept</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
    })
        }
             <!--/. endmodal exit session -->

         

    `
}
export default connect()(createModalHomePage)

export const EventModalExitSession = async function (e, findParent) {
    const btnDeleteSession = e.target.closest('.btnAcceptDeleteDepart');
    if (btnDeleteSession) {
        let modalContainer = findParent(btnDeleteSession, '.modal');
        let indexSession = modalContainer.dataset.indexsession || -1;
        modalContainer.classList.add('hidden');

        let loadingPage = Imports.$('#loadingPage');
        if (loadingPage && loadingPage.classList.contains('hidden')) {
            loadingPage.classList.remove('hidden');
        }
        try {
            const responseData =  await connect()(handleEventModalDepart)({ mapb: indexSession, nameFunc: 'exitDePart' });
            if (responseData?.state) {
                dispatch("EXITDEPART", indexSession);
                requestAnimationFrame(() => {
                    Imports.showAlert(`Bạn vừa thoát một phòng ban!`,"Warning");
                })
            } else {
                throw new Error("Yêu Cầu thoát Phòng ban bị từ chối!");
            }
        } catch (error) {
            Imports.showAlert(error.message,"Error");
        } finally {
            requestAnimationFrame(() => {
                if (loadingPage) loadingPage.classList.add('hidden');
            })
        }
    }
}

export const FORMJOINDERPART = {
    form: '#formJoinDerpart',
    onSubmit: async function (data) {
        let loadingPage = Imports.$('#loadingPage');
        if (loadingPage && loadingPage.classList.contains('hidden')) {
            loadingPage.classList.remove('hidden');
        }
        try {
            const responseData = await connect()(handleEventModalDepart)({ mapb: data.maPB, nameFunc: 'joinDePart' });
            if (responseData?.idnv && responseData?.id && responseData?.name && responseData?.isJoined) {
                dispatch("JOINDEPART", responseData);
                requestAnimationFrame(() => {
                    Imports.showAlert(`Tham gia: ${responseData.name}`);
                })
            } else  {
                throw new Error("Lỗi trong quá trình tham gia!");
            }
        } catch (error) {
            Imports.showAlert(error.message,"Error");
        } finally {
            requestAnimationFrame(() => {
                if (loadingPage) loadingPage.classList.add('hidden');
            })
        }
    }
}

async function handleEventModalDepart(state) {
    const { PersonInfor, mapb: id, nameFunc } = state;
    const { id: idnv } = PersonInfor;

    if (!idnv || !id) {
        console.error("Thiếu idnv hoặc id trong state.");
        return Promise.reject("Dữ liệu không đầy đủ.");
    }

    let data = { idnv, id };
    let loadingPage = Imports.$('#loadingPage');
    if (loadingPage && loadingPage.classList.contains('hidden')) loadingPage.classList.remove('hidden');
    try {
        const response = await window.API[nameFunc](data);
        if (response?.success) {
            return response?.data;
           
        } else {
            throw new Error("Lỗi trong quá trình thực hiện!");
        }
    } catch (error) {
       Imports.showAlert(error.message,"Error");
    }
    finally {
        if (loadingPage) loadingPage.classList.add('hidden');
    }
}