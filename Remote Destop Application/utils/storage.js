const USER_STORAGE_KEY ='UserStorage'
const SERVER_STORAGE_KEY ='ServerStorage'

export default {
    getUser() {
        return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {
            name: '',
            email: '',
            date:'',
            role: 'user',
            username: '',
            password: '',
            avartar: '',
            idUser: '',
           }
    },
    setUser(User) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(User))
    },
    getServer() {
        return JSON.parse(localStorage.getItem(SERVER_STORAGE_KEY)) || {
            name: "",
            admin: ""
           }
    },
    setServer(Server) {
        localStorage.setItem(SERVER_STORAGE_KEY, JSON.stringify(Server))
    }
    
}