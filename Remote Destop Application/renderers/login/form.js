import { connect } from '../../store.js'
import html from '../../utils/core.js'
import Validator from '../../utils/validator.js'

const connector = connect(({ User: { email, password } }) => ({ email, password }));


function formLogin({email, password}) {
    return html`
        <form action="#" class="form" id="formlogin">
            <div class="title">Sign in</div>
            <div class="spacer"></div>
            <div class="desc">Welcome back! It's nice to see you again.</div>
            <div class="spacer"></div>
    
            <div class="form-group">
                <input type="text" id='email' name='email' placeholder="Email" class='form-control' value = ${email}>
                <lable class="form-label" for='email'>Email<span class="required">*</span></lable>
                <span class="form-message"></span>
            </div>

            <div class="form-group">
                <input type="password" id='password' name='password' placeholder="Password" class='form-control'value = ${password}>
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
            Validator.isRequired('#email'),
            Validator.isEmail('#email'),
            Validator.isRequired('#password'),
            Validator.minLegth('#password', 6)
        ],
        onSubmit: async function (data) {
            try {
                const response = await window.authAPI.login(data.email, data.password);
                if (response.result == "true") {
                    console.log("Successfully logged in");
                    dispatch("Loggin", data.email, data.password);
                    // Kiểm tra quyền Notification
                    if (Notification.permission === 'granted') {
                        new Notification("Successfully logged in", { body: `Xin Chào ${data.email}` });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification("Successfully logged in", { body: `Xin Chào ${data.email}` });
                            }
                        });
                    }
                } else {
                    console.log("Failed to login");
    
                    // Kiểm tra quyền Notification
                    if (Notification.permission === 'granted') {
                        new Notification("Failed to login", { body: `${data.email} hoặc ${data.password} không chính xác` });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification("Failed to login", { body: `${data.email} hoặc ${data.password} không chính xác` });
                            }
                        });
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
}
export default connector(formLogin)