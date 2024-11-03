import storage from './utils/storage.js';
import controller from './js/App.js';
import Validator from './utils/validator.js';


const init = {
   Server : storage.getServer(),
   States: {
      isOnline: false,
      isAccessServer: false,
      isLoggedIn: false, 
   },
   EventLogs: [],
   homePage: {
      indexPage: 0
   },
   GeneralNotice:storage.getGeneralNotice(),
   NotiSession: storage.getNotiSession(),
   Account: storage.getAccount(),
   PersonInfor:{},
   Departments:[],
}


const  actions = {
    Loggin(state,email,password,personInfor,departments,HomePage) {
         state.Account.email =email;
         state.Account.password = password;
         storage.setAccount(state.Account);
         state.States.isLoggedIn = true;
         state.Departments = departments;
         state.PersonInfor = personInfor;
         controller(HomePage);
    },
    LOGOUT({States},Login,FORMLOGINOBJECT) {
         States.isLoggedIn = false;
         controller(Login,Validator,FORMLOGINOBJECT);
    },
    GOTOINDEXPAGE({homePage},indexPage) {
         homePage.indexPage = indexPage;
    },
    READALLNOTIGENARAL({GeneralNotice}) {
         GeneralNotice.forEach(element => {
            element.isUnRead=false;
         });
    },
    READNOTIGENERAL({GeneralNotice},indexNoti) {
         GeneralNotice[indexNoti].isUnRead=false;
    },
    EXITDEPART({Departments},index) {
      Departments.splice(index,1);
    },
    CHANGENAME({PersonInfor},name) {
      PersonInfor.name = name;
    },
    CHANGEAVATAR({PersonInfor},avatar) {
      PersonInfor.avatar = avatar;
    },
    CHANGEPASSWORD({PersonInfor},password) {
      PersonInfor.password = password;
    },
    JOINDEPART() {
      console.log("joining")
    },
    ISONLINE({States,EventLogs}) {
      States.isOnline= true;
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      EventLogs.push(
         {
            title:'INTERNET',
            content:'Kết nối thành công!',
            time: `${hours}: ${minutes}:  ${seconds}`,
            author:'Hệ thống',
   
         }
      )
    },
    ISOFFLINE({States,EventLogs}) {
      States.isOnline= false;
      States.isAccessServer= false;
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      EventLogs.push(
         {
            title:'INTERNET',
            content:'Kết nối thất bại!',
            time: `${hours} : ${minutes} : ${seconds}`,
            author:'Hệ thống',
   
         }
      )
    }
 }


export default function reducer(state =init, action, args) {
   actions[action] && actions[action](state,...args)
   return state
}