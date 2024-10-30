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
   EventLogs: [
      {
         title:'kết nối thất bại',
         content:'kiểm tra lại mạng',
         time:'12:00 AM',
         author:'Admin',

      },
      {
         title:'kết nối thất bại',
         content:'kiểm tra lại mạng',
         time:'12:00 AM',
         author:'Admin',

      },
      {
         title:'kết nối thất bại',
         content:'kiểm tra lại mạng',
         time:'12:00 AM',
         author:'Admin',

      },
   ],
   homePage: {
      indexPage: 0
   },
   GeneralNotice:[
      {
         title:'thông báo hủy họp',
         content:'Họp đã bị hủy bởi Admin',
         time:'12:00 AM',
         author:'Admin',
         isUnRead: false
      },
      {
         title:'thông báo dịnh hướng nghề nghiệp',
         content:'Thông báo đã dịnh hướng nghề nghiệp cho bạn',
         time:'12:30 AM',
         author:'Admin',
         isUnRead: true,
      },
      
      {
         title:'thông báo dịnh hướng nghề nghiệp',
         content:'Thông báo đã dịnh hướng nghề nghiệp cho bạn',
         time:'12:30 AM',
         author:'Admin',
         isUnRead: true,
      }, {
         title:'thông báo hủy họp',
         content:'Họp đã bị hủy bởi Admin',
         time:'12:00 AM',
         author:'Admin',
         isUnRead: false
      },
   ],
   NotiSession:[
      {
         title:'thông báo hủy họp',
         content:'Họp đã bị hủy bởi Admin',
         time:'12:00 AM',
         author:'Admin',
      },
      {
         title:'thông báo dịnh hướng nghề nghiệp',
         content:'Thông báo đã dịnh hướng nghề nghiệp cho bạn',
         time:'12:30 AM',
         author:'Admin',
      },
      
      {
         title:'thông báo dịnh hướng nghề nghiệp',
         content:'Thông báo đã dịnh hướng nghề nghiệp cho bạn',
         time:'12:30 AM',
         author:'Admin',
      }, {
         title:'thông báo hủy họp',
         content:'Họp đã bị hủy bởi Admin',
         time:'12:00 AM',
         author:'Admin',
      },
   ],
   PersonInfor: {
      avartar: 'https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-42.jpg',
      name: 'John Doe',
      email: 'john.doe@example.com',
      jobTitle: 'Software Engineer',
      department: 'IT Department',
      id: '123-456-7890',
      companyName: 'CTY TNHH',
      password: '123456789'
   },
   Departments: [
      {
         name: 'IT Department',
         isJoined: true,
      },
      {
         name: 'HR Department',
         isJoined: false,
      },
      {
         name: 'Finance Department',
         isJoined: true,
      }
   ],
  
}


const  actions = {
    Loggin({User,States},email,password,HomePage) {
        User.email =email;
        User.password = password;
        storage.setUser(User)
        States.isLoggedIn = true;
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
    }
    
 }


export default function reducer(state =init, action, args) {
   actions[action] && actions[action](state,...args)
   return state
}