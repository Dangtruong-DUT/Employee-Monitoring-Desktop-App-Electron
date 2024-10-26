import storage from './utils/storage.js';
import controller from './js/App.js';
import homePage from './renderers/home/HomePage.js';

const init = {
   User : storage.getUser(),
   Server : storage.getServer(),
   status: {
      isOnline: false,
      isAccessServer: false,
      isLoggedIn: false, 
   }
}


const actions = {
   Loggin: function({User,status},email,password) {
       User.email =email;
       User.password = password;
       storage.setUser(User)
       status.isLoggedIn = true;
       controller(homePage);
   }
   
}


export default function reducer(state =init, action, args) {
   actions[action] && actions[action](state,...args)
   return state
}