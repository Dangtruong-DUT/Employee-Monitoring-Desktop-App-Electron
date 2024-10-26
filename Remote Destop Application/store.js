import { createStore } from "./utils/core.js";
import reducer from "./reducer.js";
import withLogger from './utils/logger.js'
 
const {attach, connect, dispatch } = createStore(withLogger(reducer));

window.dispatch = dispatch

export  {
    attach,
    connect
}