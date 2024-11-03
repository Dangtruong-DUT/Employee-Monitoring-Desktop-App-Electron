
import * as Imports from './import.js';
import { FORMCHANGAVATAROBJECT, FORMCHANGEPASSWORD, FORMCHANGENAMEOBJECT } from '../renderers/home/modals/modalSettings.js';
const { $, $s, attach, Login, taskbarEvents, HeaderEvents,
    connectPageEvents, settingPageEvents, EventModalExitSession, FORMLOGINOBJECT, FORMJOINDERPART, validator } = Imports;



const app = (function () {
    const properties = {
        currentPage: null,
        root: $('#root'),
        forms: [FORMCHANGAVATAROBJECT, FORMCHANGEPASSWORD, FORMCHANGENAMEOBJECT, FORMLOGINOBJECT, FORMJOINDERPART]
    }
    // tim cha ngoai cung chua element
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    function handleForm(e) {
        // Kiểm tra nếu sự kiện xảy ra trên các input có class '.form-control'
        const inputElement = e.target.closest('.form-control');
        if (inputElement) {
            const label = inputElement.nextElementSibling;
            if (e.type == 'focusin') {
                label.style.display = 'block';
            } else if (e.type == 'focusout') {
                label.style.display = inputElement.value !== '' ? 'block' : 'none';
            }
        }
    }
    function handleModal(e) {
        // su kien ấn btn exit modal
        if (e.target.closest('.modal__btnExit')) {
            let btnExitModal = e.target.closest('.modal__btnExit');
            let modal_parent = getParent(btnExitModal, ".modal");
            if (!modal_parent.classList.contains('hidden')) {
                modal_parent.classList.add('hidden');
            }
        }
        // su kien click ngoai pham vi modal
        if (e.target.closest('.modal__overlay')) {
            let overlayElement = e.target.closest('.modal__overlay');
            let modal_parent = getParent(overlayElement, ".modal");
            if (!modal_parent.classList.contains('hidden')) {
                modal_parent.classList.add('hidden');
            }
        }
    }
    //trạng thái form ban đầu
    function initForm() {
        $s('.form-control').forEach(input => {
            if (input.value !== '') {
                input.nextElementSibling.style.display = 'block';
            }
        });
    }

    return {
        listenerNetwork() {
            window.addEventListener('online', () => {
                new Notification("Thông báo trạng thái kết nối mạng", { body: `Kết nối tới Internet thành công!` });
                dispatch("ISONLINE");
                
            });

            window.addEventListener('offline', () => {
                new Notification("Thông báo trạng thái kết nối mạng", { body: `Mất kết nối tới Internet!` });
                dispatch("ISOFFLINE");

            });
        },
        checkConnectWithInternet() {
            if (navigator.onLine) {
                dispatch("ISONLINE");
            } else {
                new Notification("Thông báo trạng thái kết nối mạng", { body: `Mất kết nối tới Internet!` });
                dispatch("ISOFFLINE");
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
            if (event.type == "focusin" || event.type == "focusout") {
                handleForm(event);
            }

            properties.forms.forEach((formObject) => {
                if (formObject&&event.target.closest(formObject.form)) {
                    new validator(formObject.form).onSubmit = formObject.onSubmit;
                }
            })

        },
        loadPage() {
            attach(properties.currentPage, properties.root);
            requestAnimationFrame(() => {
                initForm();
            });

        },
        controller(newPage) {
            properties.currentPage = newPage;
            this.loadPage();
        },
        start() {
            this.checkConnectWithInternet();
            this.controller(Login);
            
            this.listenerNetwork();
            root.onclick = this.handleEvent.bind(this);
            root.addEventListener('focusin', this.handleEvent.bind(this), true);
            root.addEventListener('focusout', this.handleEvent.bind(this), true);

           
        }
    }

})();

app.start();
export default app.controller.bind(app);



