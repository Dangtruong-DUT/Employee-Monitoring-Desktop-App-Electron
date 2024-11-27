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
    onSubmit:  function ({ email, password }) {
        
        let loadingPage = Imports.$('#loadingPage');
        if (loadingPage && loadingPage.classList.contains('hidden')) loadingPage.classList.remove('hidden');
        
        window.API.login(email, password)
        .then (response => {
                console.log(response)
            if (response?.success) {
                if (response?.data?.state) {
                    if (response?.data?.PersonInfor && response?.data?.Departments) {
                        dispatch("Loggin", email, password, response.data.PersonInfor, response.data.Departments, HomePage);
                        Imports.showAlert(`Xin Chào ${response.data?.PersonInfor?.name}`);
                    } else {
                        throw  new Error("Lỗi trong quá trình đăng nhập!");
                    }
                } else {
                   Imports.showAlert("Email hoặc Password Chưa Chính Xác!","Error");
                }
            } else {
                throw  new Error(response.message);
            }
        })
        .catch (error => {
            Imports.showAlert(error.message,"Error");
        })
        .finally(()=> {
            if (loadingPage) loadingPage.classList.add('hidden');
        })
    }

}

export default connect()(formLogin)