import * as Imports from './import.js';
const { $, $s, attach, HomePage, Login, taskbarEvents, HeaderEvents ,connectPageEvents,settingPageEvents} = Imports;

const root = $('#root')

const app = (function(){
    const properties = {
        currentPage: null,
        root: null,
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
    function handleForm (e) {
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
        handleEvent(event) {
            if (event.type==="click"){
                taskbarEvents(event);
                handleModal(event);
                HeaderEvents(event);
                connectPageEvents(event,getParent);
                settingPageEvents(event);
            } 
            if (event.type == "focusin" || event.type == "focusout") {
                console.log(event);
                handleForm(event);
            }
        },
        loadPage(handler,props,...args) {
            attach(properties.currentPage, root);
            if (handler && typeof handler =='function') handler(Object.assign({}, props, ...args));
            initForm();
        },
        controller (newPage, ...handlers) {
            properties.currentPage =newPage;
            if (handlers) this.loadPage(...handlers);
                else this.loadPage();
        },
        init() {
            attach(createView, body);
        },
        start () {
            this.controller(HomePage)
            root.onclick = this.handleEvent.bind(this)
            root.onfocusin=this.handleEvent.bind(this);
            root.onfocusout= this.handleEvent.bind(this);
        }
    }
     
})();

app.start();

export default app.controller.bind(app);



