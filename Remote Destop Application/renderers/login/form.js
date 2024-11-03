import HomePage from '../home/HomePage.js'
import * as Imports from '../../js/import.js';
const {connect, html} = Imports;


function formLogin({ Account: { email, password }}) {
    return html`
        <form action="#" class="form" id="formlogin">
            <div class="title">Sign in</div>
            <div class="spacer"></div>
            <div class="desc">Welcome back! It's nice to see you again.</div>
            <div class="spacer"></div>
    
            <div class="form-group">
                <input type="text" rules="required|email" id='loginemail' name='email' placeholder="Email" class='form-control' value = ${email}>
                <lable class="form-label"  for='email'>Email<span class="required">*</span></lable>
                <span class="form-message"></span>
            </div>

            <div class="form-group">
                <input type="password" rules="required" id='loginpassword' name='password' placeholder="Password" class='form-control'value = ${password}>
                <lable class="form-label"  for='password'>Password<span class="required">*</span></lable>
                <span class="form-message"></span>
            </div>

            <input type="submit" class=" btn form-submit  btn--primary " value='Login'>
        </form>
    `
}
export const FORMLOGINOBJECT = {
    form : '#formlogin',
    onSubmit: async function (data) {
        try {
            const response = await window.authAPI.login(data.email, data.password);
            if (response.state=="true") {
                if (response.PersonInfor && response.Departments) {
                    dispatch("Loggin", data.email, data.password,response.PersonInfor,response.Departments,HomePage);
                    new Notification("Successfully logged in", { body: `Xin Chào ${data.email}` });
                } else {
                alert("Tải trang Thất bại!");

                }
            } else {
                alert("Failed to login!, vui lòng kiểm tra password và Email");
            } 
        } catch (error) {
            console.error(error);
        }
    }

}

export default connect()(formLogin)