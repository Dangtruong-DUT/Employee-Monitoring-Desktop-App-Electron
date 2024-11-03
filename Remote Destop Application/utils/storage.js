const ACCOUNT_STORAGE_KEY = 'AccountStorage'
const SERVER_STORAGE_KEY = 'ServerStorage'
const GENERALNOTI_STORAGE_KEY = 'GeneralNotiStorage'
const SESSIONNOTI_STORAGE_KEY = 'SessionNotiStorage'

export default {
    getAccount() {
        return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || {
            email: "",
            password: ""
           }
    },
    setAccount(Account) {
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(Account))
    },
    getServer() {
        return JSON.parse(localStorage.getItem(SERVER_STORAGE_KEY)) || {
            name: "",
            admin: ""
           }
    },
    setServer(Server) {
        localStorage.setItem(SERVER_STORAGE_KEY, JSON.stringify(Server))
    },
    getGeneralNotice() {
        return JSON.parse(localStorage.getItem(GENERALNOTI_STORAGE_KEY)) || []
    },
    setGeneralNotice(noti) {
        localStorage.setItem(GENERALNOTI_STORAGE_KEY, JSON.stringify(noti))
    },
    getNotiSession() {
        return JSON.parse(localStorage.getItem(SESSIONNOTI_STORAGE_KEY)) || []
    },
    setNotiSession(noti) {
        localStorage.setItem(SESSIONNOTI_STORAGE_KEY, JSON.stringify(noti))
    },
    
}