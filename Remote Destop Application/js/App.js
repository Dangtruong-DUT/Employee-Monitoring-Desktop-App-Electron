import {$, $s} from '../utils/core.js'
import {attach,connect} from '../store.js'
import handleForm from './handleForm.js';
import loginPage,{FORMLOGINOBJECT} from '../renderers/login/loginPage.js'



const root = $('#root')

const app = (function(){
    const properties = {
        currentPage: null,
    }
    return {
        loadPage(handler,props,...args) {
            attach(properties.currentPage, root);
            if (handler && typeof handler =='function') handler(Object.assign({}, props, ...args));
        },
        controller (newPage, ...handlers) {
            properties.currentPage =newPage;
            this.loadPage(...handlers);
        },
        start () {
           this.controller(loginPage,handleForm,FORMLOGINOBJECT);
           
        }
    }
     
})();

app.start();

export default app.controller.bind(app);



