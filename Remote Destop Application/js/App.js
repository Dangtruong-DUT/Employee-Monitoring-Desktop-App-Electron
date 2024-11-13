
import * as Imports from './import.js';
import waitingConnection from '../renderers/waitingConnection.js';
import { FORMCHANGAVATAROBJECT, FORMCHANGEPASSWORD, FORMCHANGENAMEOBJECT }
    from '../renderers/home/modals/modalSettings.js';
const { $, $s, attach, Login, taskbarEvents, HeaderEvents,connectPageEvents, 
    settingPageEvents, EventModalExitSession,FORMLOGINOBJECT, FORMJOINDERPART, validator } = Imports;

const app = (function () {
    const properties = {
        currentPage: null,
        previousPage: null,
        root: $('#root'),
        forms: [FORMCHANGAVATAROBJECT, FORMCHANGEPASSWORD, FORMCHANGENAMEOBJECT, FORMLOGINOBJECT, FORMJOINDERPART]
    };
    
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function handleForm(e) {
        const inputElement = e.target.closest('.form-control');
        if (inputElement) {
            const label = inputElement.nextElementSibling;
            if (e.type === 'focusin') {
                label.style.display = 'block';
            } else if (e.type === 'focusout') {
                label.style.display = inputElement.value !== '' ? 'block' : 'none';
            }
        }
    }

    function handleModal(e) {
        if (e.target.closest('.modal__btnExit')) {
            let btnExitModal = e.target.closest('.modal__btnExit');
            let modal_parent = getParent(btnExitModal, ".modal");
            if (!modal_parent.classList.contains('hidden')) {
                modal_parent.classList.add('hidden');
            }
        }
        if (e.target.closest('.modal__overlay')) {
            let overlayElement = e.target.closest('.modal__overlay');
            let modal_parent = getParent(overlayElement, ".modal");
            if (!modal_parent.classList.contains('hidden')) {
                modal_parent.classList.add('hidden');
            }
        }
    }

    function initForm() {
        $s('.form-control').forEach(input => {
            if (input.value !== '') {
                input.nextElementSibling.style.display = 'block';
            }
        });
    }

    return {
        getTime() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            return `${hours} : ${minutes} : ${seconds}`;
        },
        listenerNetwork() {
            window.addEventListener('online', () => {
                this.handleOnline();
            });
            window.addEventListener('offline', () => {
                this.handleOffline();
            });
        },
        checkConnectWithInternet() {
            if (navigator.onLine) {
                dispatch("ISONLINE");
            } else {
                this.handleOffline();
            }
        },
        handleOnline() {
            Imports.showAlert(`Đã kết nối tới Internet!`,"Info");
            if (properties.currentPage == waitingConnection
                &&properties.previousPage!=waitingConnection) {
                this.controller(properties.previousPage);
            } else {
                this.controller(Login);
            }
            const loadingPage = $('#loadingPage');
            if (loadingPage) loadingPage.classList.add('hidden');
            dispatch("ISONLINE");
        },
        handleOffline() {
            Imports.showAlert(`Mất kết nối tới Internet!`,"Warning");
            dispatch("ISOFFLINE");
            const loadingPage = $('#loadingPage');
            if (loadingPage && loadingPage.classList.contains('hidden')) loadingPage.classList.remove('hidden');
            setTimeout(() => {
                if (!navigator.onLine) {
                    this.controller(waitingConnection);
                }
                if (loadingPage) loadingPage.classList.add('hidden');
            }, 10000);
        },
        listenerSocketIO() {
            window.API.receiveMessage("socket-status", this.handleSocketStatus.bind(this));
            window.API.receiveMessage("socket-notifySession", this.handleSocketNotifySession.bind(this));
            window.API.receiveMessage("socket-notify", this.handleSocketNotify.bind(this));
        },
        handleSocketNotifySession(data) {
            if (data && data?.title 
                && data?.content 
                &&data?.author) {
                    Imports.showAlert('Thông Báo:'+data.title, "Info");
                    dispatch("NEWNOTIFYSESSION", data);
            }
        },
        handleSocketNotify(data) {
            if (data && data?.title 
                && data?.content 
                &&data?.author) {
                    Imports.showAlert('Thông Báo:'+data.title, "Info");
                    dispatch("NEWNOTIFY", data);
            }
        },
        handleSocketStatus(data) {
            let isconnected = true;
            if (data.status == "connected" ) {
                const eventlog = {
                    title: "SOCKET STATUS",
                    content: 'Kết nối thành công với server!',
                    time: this.getTime(),
                    author: "Hệ thống"
                };
                Imports.showAlert("Đã kết nối thành công với server!","Info");
                dispatch("CHECKACCESSSERVER", eventlog,isconnected);
            } else if (data.status == "error") {
                const eventlog = {
                    title: "SOCKET STATUS",
                    content: `Error: ${data.error}`,
                    time: this.getTime(),
                    author: "Hệ thống"
                };
                Imports.showAlert("Mất kết nối với server!","Error");
                dispatch("CHECKACCESSSERVER", eventlog,false);
            } else if (data.status == "disconnected" ) {
                isconnected = false;
                const eventlog = {
                    title: "SOCKET STATUS",
                    content: 'Mất kết nối với server!',
                    time: this.getTime(),
                    author: "Hệ thống"
                };
                Imports.showAlert("Mất kết nối với server!","Warning");
                dispatch("CHECKACCESSSERVER", eventlog,isconnected);
            }
            if (data?.ServerInfor) {
                dispatch("SAVERSERVER", data?.ServerInfor);
            }
        },
        handleEvent(event) {
            if (event.type === "click") {
                taskbarEvents(event);
                handleModal(event);
                HeaderEvents(event);
                connectPageEvents(event, getParent);
                settingPageEvents(event);
                EventModalExitSession(event, getParent);
            }
            if (event.type === "focusin" || event.type === "focusout") {
                handleForm(event);
            }
            properties.forms.forEach((formObject) => {
                if (formObject && event.target.closest(formObject.form)) {
                    new validator(formObject.form).onSubmit = formObject.onSubmit;
                }
            });
            var ctx = document.getElementById('myChart')?.getContext('2d');
            if (ctx) {
                // Kiểm tra nếu đã có một chart cũ
                    if (window.myChart instanceof Chart) {
                        window.myChart.destroy(); // Hủy bỏ chart cũ
                    }
                var myChart = new Chart(ctx, {
                    type: 'line', // Loại biểu đồ: line, bar, pie, etc.
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Nhãn trên trục x
                        datasets: [{
                            label: 'Doanh thu', // Tên của dataset
                            data: [12, 19, 3, 5, 2, 3], // Dữ liệu biểu đồ
                            borderColor: 'rgba(75, 192, 192, 1)', // Màu viền
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        },
        loadPage() {
            attach(properties.currentPage, properties.root);
            requestAnimationFrame(() => {
                initForm();
            });
        },
        controller(newPage) {
            properties.previousPage = properties.currentPage;
            properties.currentPage = newPage;
            this.loadPage();
        },
        start() {
            this.controller(Login);
            this.checkConnectWithInternet();
            this.listenerNetwork();
            this.listenerSocketIO(); 
            root.onclick = this.handleEvent.bind(this);
            root.addEventListener('focusin', this.handleEvent.bind(this), true);
            root.addEventListener('focusout', this.handleEvent.bind(this), true);
        }
    };

})();

app.start();
export default app.controller.bind(app);



