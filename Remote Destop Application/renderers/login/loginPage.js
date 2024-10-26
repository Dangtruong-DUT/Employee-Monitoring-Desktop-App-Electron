import html from '../../utils/core.js'
import intro from './intro.js'
import form from './form.js'

function Login () {
    return html`
       <section class="formlogin-container  grid__row">
                <div class="formlogin grid__column-7">
                   ${form()}
                </div>
                
                <div class="grid__column-5 formlogin-intro">
                    ${intro()}
                </div>
                
        </section>
    `
}
export {FORMLOGINOBJECT} from './form.js'
export default Login