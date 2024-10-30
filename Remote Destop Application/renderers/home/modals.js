import * as Imports from '../../js/import.js';
const {connect, html } = Imports;
import createModalHomePage from "./modals/modalHomePage.js"
import createModalSettings from "./modals/modalSettings.js"

function createmodals({homePage:{indexPage}}) {
    return html `
        ${
            ((indexPage == 2)&& html`
                ${createModalSettings()}
            `)
             ||
            ((indexPage == 0)&&html`
                ${createModalHomePage()}
            ` )
        }
    `
}

export default  connect()(createmodals) 