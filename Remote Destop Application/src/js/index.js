import * as Imports from './import.js';
import waitingConnection from '../renderers/waitingConnection.js';
import { FORMCHANGAVATAROBJECT, FORMCHANGEPASSWORD, FORMCHANGENAMEOBJECT }
    from '../renderers/home/modals/modalSettings.js';
const { $, $s, attach, Login, taskbarEvents, HeaderEvents, connectPageEvents, 
    settingPageEvents, EventModalExitSession, FORMLOGINOBJECT, FORMJOINDERPART, validator } = Imports;
import { ClientSocketWS } from '../utils/clientSocketUtil.js';
const socket =new ClientSocketWS();

const app = (function () {
    const properties = {
        currentPage: null,
        previousPage: null,
        root: $('#root'),
        forms: [FORMCHANGAVATAROBJECT, FORMCHANGEPASSWORD, FORMCHANGENAMEOBJECT, FORMLOGINOBJECT, FORMJOINDERPART]
    };

    // Helper functions
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function toggleLabelVisibility(inputElement, action) {
        const label = inputElement.nextElementSibling;
        label.style.display = action === 'focusin' || inputElement.value !== '' ? 'block' : 'none';
    }

    function handleModal(e) {
        const modal = e.target.closest('.modal__btnExit') || e.target.closest('.modal__overlay');
        if (modal) {
            const modalParent = getParent(modal, '.modal');
            if (modalParent && !modalParent.classList.contains('hidden')) {
                modalParent.classList.add('hidden');
            }
        }
    }

    function initForm() {
        $s('.form-control').forEach(input => {
            toggleLabelVisibility(input, input.value !== '' ? 'focusin' : 'focusout');
        });
    }

    function paintingChart() {
        const ctx = document.getElementById('revenueChart')?.getContext('2d');
        if (ctx) {
            if (window.myChart instanceof Chart) {
                window.myChart.destroy();
            }
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Doanh thu',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: 'orange',
                        borderWidth: 1
                    }]
                },
                options: { scales: { y: { beginAtZero: true } } }
            });
        }
    }

    function handleNetworkStatusChange(isOnline) {
        const loadingPage = $('#loadingPage');
        const page = isOnline ? Login : waitingConnection;

        if (loadingPage) loadingPage.classList.toggle('hidden', isOnline);
        dispatch(isOnline ? "ISONLINE" : "ISOFFLINE");

        if (isOnline && properties.currentPage === waitingConnection && properties.previousPage !== waitingConnection) {
            this.controller(properties.previousPage);
        } else {
            this.controller(page);
        }
    }

    // Socket event handlers
    function handleSocketStatus(data) {
        const { status, error, ServerInfor } = data;
        let isconnected = status === 'connected';
        const eventlog = {
            title: "SOCKET STATUS",
            content: isconnected ? 'Kết nối thành công với server!' : `Error: ${error || 'Mất kết nối với server!'}`,
            time: this.getTime(),
            author: "Hệ thống"
        };
        Imports.showAlert(isconnected ? "Đã kết nối thành công với server!" : "Mất kết nối với server!", isconnected ? "Info" : "Warning");
        dispatch("CHECKACCESSSERVER", eventlog, isconnected);
        if (ServerInfor) dispatch("SAVERSERVER", ServerInfor);
    }

    function handleSocketNotify(data) {
        if (data?.title && data?.content && data?.author) {
            Imports.showAlert(`Thông Báo: ${data.title}`, "Info");
            dispatch(data?.type === "socket-notifySession" ? "NEWNOTIFYSESSION" : "NEWNOTIFY", data);
        }
    }

    return {
        getTime() {
            const now = new Date();
            return `${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`;
        },
        listenerNetwork() {
            window.addEventListener('online', () => handleNetworkStatusChange.call(this, true));
            window.addEventListener('offline', () => handleNetworkStatusChange.call(this, false));
        },
        checkConnectWithInternet() {
            handleNetworkStatusChange.call(this,navigator.onLine);
        },
        listenerSocketIO() {
            window.API.receiveMessage("socket-status", handleSocketStatus.bind(this));
            window.API.receiveMessage("socket-notifySession", handleSocketNotify.bind(this));
            window.API.receiveMessage("socket-notify",handleSocketNotify.bind(this));
            window.API.receiveMessage("login-success",socket.connect.bind(socket));
            
            
        },
        handleEvent(event) {
            const handlers = {
                click: () => {
                    taskbarEvents(event);
                    handleModal(event);
                    HeaderEvents(event);
                    connectPageEvents(event, getParent);
                    settingPageEvents(event);
                    EventModalExitSession(event, getParent);
                },
                focusin: () => event.target.closest('.form-control')
                            ?toggleLabelVisibility(event.target.closest('.form-control'), 'focusin')
                            :false,
                focusout: () =>event.target.closest('.form-control')
                            ? toggleLabelVisibility(event.target.closest('.form-control'), 'focusout')
                            :false,
            };

            if (handlers[event.type]) handlers[event.type]();
            properties.forms.forEach((formObject) => {
                if (formObject && event.target.closest(formObject.form)) {
                    new validator(formObject.form).onSubmit = formObject.onSubmit;
                }
            });
        },
        loadPage() {
            attach(properties.currentPage, properties.root);
            requestAnimationFrame(initForm);
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
            properties.root.addEventListener('click', this.handleEvent.bind(this));
            properties.root.addEventListener('focusin', this.handleEvent.bind(this), true);
            properties.root.addEventListener('focusout', this.handleEvent.bind(this), true);
        }
    };
})();
console.log(navigator);
app.start();
export default app.controller.bind(app);
