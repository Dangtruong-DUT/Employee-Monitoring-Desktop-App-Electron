const ACCOUNT_STORAGE_KEY = 'AccountStorage'
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