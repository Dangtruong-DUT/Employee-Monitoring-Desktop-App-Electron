export {$, $s } from '../utils/core.js'
export {attach,connect} from '../store.js'
export { taskbarEvents } from '../renderers/home/taskbar.js';
export { HeaderEvents } from '../renderers/home/header.js';
export { connectPageEvents } from '../renderers/home/components/connectPage.js';
export {settingPageEvents} from '../renderers/home/components/settingPage.js'
import connectPage from '../renderers/home/components/connectPage.js';
export { connectPage };

import Login from '../renderers/login/loginPage.js';
export { Login };

import HomePage from '../renderers/home/HomePage.js';
export { HomePage };

import  html  from '../utils/core.js'
export { html };