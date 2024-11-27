import * as Imports from '../../../js/import.js';
const {connect, html } = Imports;

function pageAdminSettings({PersonInfor,Departments,Server,States,EventLogs,filters}) {
    
    return html`
       <div class="adminSetting__main ">
                        <section class="wellcomeTitleCotainer">
                            <div class="wellcomeTitleCotainer__title">Hi ${PersonInfor?.name}</div>
                            <div class="wellcomeTitleCotainer__desc">Welcome to the Admin settings page</div>
                        </section>
                        <!--content adminSetting-->
                        <div class ="settingAdmin__container">
                        <section class="container-adminSetting">
                            <section class="group-setting ">
                                <div class="group__title">Thông tin nhân sự</div>
                                <div class="group__content">
                                    <div class="group__item">
                                        <div class="group__item-title">Họ và tên</div>
                                        <div class="group__item-content">${PersonInfor?.name}</div>
                                    </div>
                                    <div class="group__item">
                                        <div class="group__item-title">Email</div>
                                        <div class="group__item-content">${PersonInfor?.email}</div>
                                    </div>
                                    <div class="group__item">
                                        <div class="group__item-title">Bộ phận</div>
                                        <div class="group__item-content">
                                        ${Departments
                                            .filter(filters["joined"])
                                            .map(element => {
                                            return element.name;
                                        }).join(", ")}</div>
                                    </div>
                                    <div class="group__item">
                                        <div class="group__item-title">
                                            chức vụ
                                        </div>
                                        <div class="group__item-content">${PersonInfor?.jobTitle}</div>
                                    </div>
                                    <div class="group__item">
                                        <div class="group__item-title">
                                            Mã nhân viên
                                        </div>
                                        <div class="group__item-content">${PersonInfor?.id}</div>
                                    </div>
                                    <div class="group__item">
                                        <div class="group__item-title">
                                            Đơn vị
                                        </div>
                                        <div class="group__item-content">${PersonInfor?.companyName}</div>
                                    </div>
                                </div>
                            </section>
                            <section class="group-setting ">
                                <div class="group__title">Thông tin kết nối tới server</div>
                                <div class="group__content">
                                    <div class="group__item">
                                        <div class="group__item-title">Admin</div>
                                        <div class="group__item-content">${(States.isAccessServer&&Server?.admin)||'_____'}</div>
                                    </div>
                                    <div class="group__item">
                                        <div class="group__item-title">Trạng thái kết nối</div>
                                        <div class="group__item-content">${(States.isAccessServer&&'Kết nối thành công')||'Chưa kết nối với server'}</div>
                                    </div>
                                    <div class="group__item group__item--img">
                                        <img class="group-item__img"  src="../src/assets/imgs/connectServer.png" alt="img">
                                    </div>
                                </div>

                            </section>
                            <section class="group-setting group-setting--eventlog ">
                                <div class="group__title ">Event Log</div>
                                <div class="group__content group__content--eventlog">
                                ${EventLogs.map(item => html`
                                    <div class="group__item group__item--eventlog">
                                        <div class="group__item-title">${item.title}</div>
                                        <div class="group__item-content">${item.content+";  Time: "+item.time+";  From: "+item.author}</div>
                                    </div>
                                    `
                                )}
                                </div>

                            </section>

                             <section class="group-setting ">
                                <div class="group__title">Biểu Đồ Ghi Nhận Từ Admin</div>
                                <div class="group__content" >
                                     <canvas id="revenueChart" class="chart"></canvas>
                                </div>

                            </section>
                            <!--/. end content adminSetting-->
                        </section>
                        </div>
                    </div>
    `
}

export default connect()(pageAdminSettings)