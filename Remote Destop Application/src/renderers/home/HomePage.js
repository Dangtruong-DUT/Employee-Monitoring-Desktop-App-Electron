import * as Imports from '../../js/import.js';
const {connect, html } = Imports;

import taskbar from './taskbar.js'
import homePageComponent from './homepageContent.js'
import modals from './modals.js';

function homePage({ homePage: { indexPage } }) {
    
     return html`
        <div class="homepage-container">
            ${taskbar()}
            ${homePageComponent(indexPage)}
            ${modals()}
        </div>
     `
}
export default connect()(homePage)

