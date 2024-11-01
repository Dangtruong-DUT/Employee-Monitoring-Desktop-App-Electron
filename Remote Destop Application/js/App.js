
import * as Imports from './import.js';
import { FORMCHANGAVATAROBJECT,FORMCHANGEPASSWORD,FORMCHANGENAMEOBJECT } from '../renderers/home/modals/modalSettings.js';
const { $, $s, attach, Login, taskbarEvents, HeaderEvents ,
    connectPageEvents,settingPageEvents,EventModalExitSession,FORMLOGINOBJECT,FORMJOINDERPART,validator} = Imports;

const app = (function(){
    const properties = {
        currentPage: null,
        root: $('#root'),
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
                EventModalExitSession(event,getParent);
            } 
            if (event.type == "focusin" || event.type == "focusout") {
                handleForm(event);
            }
        },
        validaterForms(indexPage) {

            requestAnimationFrame(() => {
                if (indexPage==0) {
                    validator(FORMJOINDERPART)
                } else if (indexPage == -1) {
                    validator(FORMLOGINOBJECT)
                } else if (indexPage == 2) {
                    validator(FORMCHANGAVATAROBJECT)
                    validator(FORMCHANGEPASSWORD)
                    validator(FORMCHANGENAMEOBJECT)
                }
                
            })  
        },
        loadPage() {
            attach(properties.currentPage, properties.root);
            requestAnimationFrame(() => {
                initForm();
            });
                
        },
        controller (newPage) {
            properties.currentPage =newPage;
            this.loadPage();
        },
        start () {
            this.controller(Login)
            this.validaterForms(-1);
            root.onclick = this.handleEvent.bind(this)
            root.addEventListener('focusin', this.handleEvent.bind(this), true);
            root.addEventListener('focusout', this.handleEvent.bind(this), true);
        }
    }
     
})();

app.start();

window.validaterForms = app.validaterForms.bind(app);
export default app.controller.bind(app);



