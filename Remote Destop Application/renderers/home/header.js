import * as Imports from '../../js/import.js';
const {connect, html } = Imports;

import login , {FORMLOGINOBJECT} from '../login/loginPage.js';


function header({States:{isAccessServer} ,PersonInfor:{avartar,name},GeneralNotice, homePage}) {
    return html`
         <!--header-->
                <header class="hompage-header grid__row ">
                    <div class="hompage-header__title hearder--left">${homePage.indexPage==0&&'Home'||homePage.indexPage==1&&'AdminSettings'||homePage.indexPage==2&&'Settings'}</div>
                    <ul class="hompage-header__listItem  header--right">
                        <li class="hompage-header__item hompage-header__item--bgCircle"><svg class="icon icon--fillNone icon--active icon--normal"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path stroke-width="1.5"
                                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22Z" />
                            </svg></li>
                        <li class="hompage-header__item hompage-header__item-noti hompage-header__item--bgCircle">
                            <svg class="icon header__icon--noti icon--fillNone icon--normal" xmlns="http://www.w3.org/2000/svg" 
                                 viewBox="0 0 14 14">
                                <path  stroke-linecap="round" stroke-linejoin="round"
                                    d="M7 .5a4.29 4.29 0 0 1 4.29 4.29c0 4.77 1.74 5.71 2.21 5.71H.5c.48 0 2.21-.95 2.21-5.71A4.29 4.29 0 0 1 7 .5ZM5.5 12.33a1.55 1.55 0 0 0 3 0" />
                            </svg>
                            <div class="header__count-noti">
                                <span>${ GeneralNotice.reduce((countUnRead,noti)=>noti.isUnRead&&++countUnRead||countUnRead,0)}</span>
                            </div>
                            <div class="combobox__dropdown header__dropdown--noti ">
                                <ul class="combobox__dropdown-list combobox__dropdown-list--notiheader">
                                    ${  GeneralNotice.map((noti,index) => {
                                        return html`
                                            <li class="headerNotiItem combobox__dropdown-item ${noti.isUnRead ? 'noti--unread' : ''}"  data-indexnoti="${index}">
                                                <div class="notify-sesion__material notify-sesion__material--notiHeader">
                                                    <div class="notify-sesion__material-title title--noti">${noti.title}</div>
                                                    <div class="notify-sesion__material-desc">
                                                        <div class="notify-sesion__material-desc-user">${noti.author}</div>
                                                        <div class="notify-sesion__material-desc-time">${noti.time}</div>
                                                        <div class="notify-sesion__material-desc-content">
                                                            ${noti.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        `;
                                    })
                                }
                                ${
                                     GeneralNotice.length == 0 &&
                                        `<li class="combobox__dropdown-item ">
                                        <div class="notify-sesion__material notify-sesion__material--notiHeader">
                                            <div class="notify-sesion__material-title  title--noti">Bạn Chưa có Thông báo nào</div>
                                            <div class="notify-sesion__material-desc">
                                                <div class="notify-sesion__material-desc-content">
                                                </div>
                                            </div>

                                        </div>
                                        </li>`
    
                                }
                                </ul>
                                ${
                                    GeneralNotice.reduce((countUnRead,noti)=>noti.isUnRead&&++countUnRead||countUnRead,0)>0 &&
                                        ` <div class=" combobox-noti__btn-readAll">
                                                <div class=" btn--home-btnNoti btnHeaderReadAll" >Xem tất cả</div>
                                        </div>`
                                }
                               
                            </div>
                        </li>
                        <!--Avatar& name User bỏ state online thì css sẽ tương ứng offline-->
                        <li class="hompage-header__item header__item--inforUser">
                            <img class="header__avatar"
                                src=" ${avartar || 'https://cdn.icon-icons.com/icons2/2120/PNG/512/user_account_person_avatar_icon_131248.png'}"
                                alt="">
                            <span class="header__title ${isAccessServer && 'state--online'} ">${name}</span>
                            <div class="combobox__dropdown header__dropdown">
                                <ul class="combobox__dropdown-list">
                                    <li class="combobox__dropdown-item header-dropdown__item-infor" data-indexpage="2">Edit profile</li>
                                    <li class="combobox__dropdown-item header-dropdown__item-infor" data-indexpage="1">Admin Setting</li>
                                    <li class="combobox__dropdown-item header-dropdown__item-infor" data-indexpage="-1">Logout</li>
                                </ul>
                            </div>
                        </li>
                        <!--/. End Avatar& name -->
                    </ul>
                </header>
               
                <!--/. end header-->

    `

}


export default connect()(header)

export const HeaderEvents = function (event) {
    let comboboxItem = event.target.closest('.header-dropdown__item-infor');
    if (comboboxItem) {
        let indexPage = comboboxItem.dataset.indexpage;
        if (indexPage == '-1') dispatch('LOGOUT', login, FORMLOGINOBJECT);
        else {
            dispatch('GOTOINDEXPAGE', indexPage);
        }

    };
    let btnReadAll = event.target.closest('.btnHeaderReadAll');
    if (btnReadAll) {
        dispatch('READALLNOTIGENARAL');
        alert("Bạn vừa đọc tất cả thông báo!")
    }
    let notiItem = event.target.closest('.headerNotiItem');
    if (notiItem) {
        let indexNoti = notiItem.dataset.indexnoti;
        dispatch('READNOTIGENERAL', indexNoti);
        alert("Thông báo đã đọc: "+notiItem.querySelector('.title--noti').innerText)
    }
}