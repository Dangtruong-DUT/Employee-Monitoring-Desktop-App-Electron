import HomePage from '../home/HomePage.js'
import * as Imports from '../../js/import.js';
import { FORMJOINDERPART } from '../home/modals/modalHomePage.js';
const {validator,connect, html} = Imports;


function formLogin({ PersonInfor: { email, password }}) {
    return html`
        <form action="#" class="form" id="formlogin">
            <div class="title">Sign in</div>
            <div class="spacer"></div>
            <div class="desc">Welcome back! It's nice to see you again.</div>
            <div class="spacer"></div>
    
            <div class="form-group">
                <input type="text" id='loginemail' name='email' placeholder="Email" class='form-control' value = ${email}>
                <lable class="form-label" for='email'>Email<span class="required">*</span></lable>
                <span class="form-message"></span>
            </div>

            <div class="form-group">
                <input type="password" id='loginpassword' name='password' placeholder="Password" class='form-control'value = ${password}>
                <lable class="form-label" for='password'>Password<span class="required">*</span></lable>
                <span class="form-message"></span>
            </div>

            <input type="submit" class=" btn form-submit  btn--primary " value='Login'>
        </form>
    `
}
export const FORMLOGINOBJECT = {
        form: '#formlogin',
        formGroupSelector: '.form-group',
        errorSelector: '.form-message',
        rules: [
            validator.isRequired('#loginemail'),
            validator.isEmail('#loginemail'),
            validator.isRequired('#loginpassword'),
            validator.minLegth('#loginpassword', 6)
        ],
        onSubmit: async function (data) {
            try {
                const response = await window.authAPI.login(data.email, data.password);
                if (response.result == "true") {
                    console.log("Successfully logged in");
                    dispatch("Loggin", data.email, data.password,HomePage);
                    validaterForms(0);

                    // Kiểm tra quyền Notification
                    if (Notification.permission === 'granted') {
                        new Notification("Successfully logged in", { body: `Xin Chào ${data.email}` });
                    } 
    
                } else {
                    console.log("Failed to login");
                    // Kiểm tra quyền Notification
                    if (Notification.permission === 'granted') {
                        new Notification("Failed to login", { body: `${data.email} hoặc ${data.password} không chính xác` });
                    } 
                }
            } catch (error) {
                console.error(error);
            }
        }
}
export default connect()(formLogin)