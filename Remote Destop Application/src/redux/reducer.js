import storage from './storage.js';
import controller from '../js/index.js';
import Validator from '../utils/validator.js';


const daysBetween = (date1, date2) => {
   const oneDay = 24 * 60 * 60 * 1000;
   return Math.round(Math.abs((date1 - date2) / oneDay));
};

const parseDate = (dateString) => {
   const [day, month, year] = dateString.split('/').map(Number);
   return new Date(year, month - 1, day); // Tháng bắt đầu từ 0
};

const filterNotifications = (notifications, allowedDays) => {
   const currentDate = new Date();
   return notifications.filter(notification => {
      const notificationDate = parseDate(notification.date);
      return daysBetween(notificationDate, currentDate) <= allowedDays;
   });
};

const init = {
   Server: {
      name: "",
      admin: ""
   },
   States: {
      isOnline: false,
      isAccessServer: false,
      isLoggedIn: false,
   },
   EventLogs: [],
   homePage: {
      indexPage: 0
   },
   GeneralNotice: filterNotifications(storage.getGeneralNotice(),8),
   NotiSession: filterNotifications(storage.getNotiSession(),2),
   Account: storage.getAccount(),
   PersonInfor: {},
   Departments: [],
   filters: {
      all: () => true,
      spending: depart => !depart.isJoined,
      joined: depart => depart.isJoined,
   },
   addDateToObject(obj) {
      const currentDate = new Date().toLocaleDateString('vi-VN');
      const currentTime = new Date().toLocaleTimeString('vi-VN');
      obj.time = currentTime;
      obj.date = currentDate;
   },
   render:{
      isRender: true,
   }
}


const actions = {
   Loggin(state, email, password, personInfor, departments, HomePage) {
      state.Account.email = email;
      state.Account.password = password;
      storage.setAccount(state.Account);
      state.States.isLoggedIn = true;
      state.Departments = departments;
      state.PersonInfor = personInfor;
      controller(HomePage);
   },
   LOGOUT({ States }, Login, FORMLOGINOBJECT) {
      States.isLoggedIn = false;
      controller(Login, Validator, FORMLOGINOBJECT);
   },
   GOTOINDEXPAGE({ homePage }, indexPage) {
      homePage.indexPage = indexPage;
   },
   READALLNOTIGENARAL({ GeneralNotice }) {
      GeneralNotice.forEach(element => {
         element.isUnRead = false;
      });
   },
   READNOTIGENERAL({ GeneralNotice }, indexNoti) {
      GeneralNotice[indexNoti].isUnRead = false;
   },
   EXITDEPART({ Departments }, idToDelete) {
      const index = Departments.findIndex(department => department.id == idToDelete);
      if (index !== -1) {
         Departments.splice(index, 1);  // Xóa phòng ban tại chỉ số tìm được
      }
   },
   CHANGENAME({ PersonInfor }, name) {
      PersonInfor.name = name;
   },
   CHANGEAVATAR({ PersonInfor }, avatar) {
      PersonInfor.avatar = avatar;
   },
   CHANGEPASSWORD({ PersonInfor }, password) {
      PersonInfor.password = password;
   },
   JOINDEPART({ Departments }, department) {
      Departments.push(department)
   },
   ISONLINE({ States, EventLogs }) {
      States.isOnline = true;
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      EventLogs.push(
         {
            title: 'INTERNET',
            content: 'Kết nối thành công!',
            time: `${hours}: ${minutes}:  ${seconds}`,
            author: 'Hệ thống',

         }
      )
   },
   ISOFFLINE({ States, EventLogs }) {
      States.isOnline = false;
      States.isAccessServer = false;
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      EventLogs.push(
         {
            title: 'INTERNET',
            content: 'Kết nối thất bại!',
            time: `${hours} : ${minutes} : ${seconds}`,
            author: 'Hệ thống',

         }
      )
   },
   CHECKACCESSSERVER({ States, EventLogs }, eventLog, isconnected) {
      if (isconnected) {
         States.isAccessServer = true;
         EventLogs.push(eventLog);
      } else {
         States.isAccessServer = false;
         EventLogs.push(eventLog);
      }
   },
   SAVERSERVER({ EventLogs, Server }, serverInfor) {
      Server.name = serverInfor?.name;
      Server.admin = serverInfor?.admin;
      EventLogs.push(
         {
            title: 'SERVER',
            content: 'Đang ở trạng thái quản lý bởi !',
            time: `${new Date().getHours()}: ${new Date().getMinutes()}: ${new Date().getSeconds()}`,
            author: 'Hệ thống',

         }
      )
   },
   NEWNOTIFYSESSION( {NotiSession,addDateToObject,render,homePage},noti) {
      render.isRender = false;
      addDateToObject(noti);
      NotiSession.push(noti);
      storage.setNotiSession(NotiSession);
   },
   NEWNOTIFY({GeneralNotice,addDateToObject,render,homePage},noti ) {
      render.isRender = false;
      addDateToObject(noti);
      noti.isUnRead = true;
      GeneralNotice.push(noti);
      storage.setGeneralNotice(GeneralNotice);
   }
}




export {actions}

export default function reducer(state = init, action, args) {
   actions[action] && actions[action](state, ...args)
   return state
}