import * as Imports from '../../js/import.js';
const {connect, html } = Imports;


import header from './header.js'
import footer from './footer.js'
import connectPage from './components/connectPage.js'
import settingPage from './components/settingPage.js'
import pageAdminSettings from './components/adminSettingPage.js'

function homePageComponent(indexPage) {
    return html`
        <section class="homepage-content">
            <!--header-->
            ${header()}
            <!--./end header-->
             <main class="container__main">
               ${indexPage==0&&connectPage()||indexPage==1&&pageAdminSettings()||indexPage==2&&settingPage()}
             </main>
            <!--footer-->
            ${footer()}
            <!--./end footer-->

        </section>
        
    `
}

export default homePageComponent