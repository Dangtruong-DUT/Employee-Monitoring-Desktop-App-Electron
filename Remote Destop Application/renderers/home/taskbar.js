import * as Imports from '../../js/import.js';
import { FORMJOINDERPART } from './modals/modalHomePage.js';
const {connect, html } = Imports;
import {FORMCHANGAVATAROBJECT,FORMCHANGEPASSWORD,FORMCHANGENAMEOBJECT} from './modals/modalSettings.js'

function taskbar({homePage:{indexPage}}) {
    return html`
            <!--taskbar-->
            <section class="homepage__taskbar">
                <ul class="taskbar-list">
                    <li class="taskbar__item ${indexPage==0&&'taskbar__item--active'}" data-indexpage="0"><svg class="icon" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="m12 4.27l9.577 7.172l-.623.793L19 10.769V20H5v-9.23l-1.954 1.465l-.623-.793zm-3.496 8.198q0 1.003 1.079 2.138T12 16.962q1.377-1.221 2.456-2.355t1.079-2.134q0-.83-.57-1.383q-.57-.551-1.368-.551q-.493 0-.896.204q-.403.205-.701.515q-.26-.31-.678-.515q-.418-.204-.875-.204q-.8 0-1.372.548q-.571.549-.571 1.381M18 19v-9l-6-4.5L6 10v9zm0 0H6z" />
                        </svg>
                        <div class="taskbar_item__title">Home</div>
                    </li>
                    <li class="taskbar__item  ${indexPage==1&&'taskbar__item--active'}" data-indexpage="1"><svg class="icon " xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 24 24">
                            <path  d="M2 22V8.5L12 2l10 6.5V22l-10-7Zm10-9.4l6.325-4.1L12 4.4L5.675 8.5Z" />
                        </svg>
                        <div class="taskbar_item__title">Admin Setting</div>
                    </li>
                </ul>
                <ul class="taskbar-list">
                    <li class="taskbar__item  ${indexPage==2&&'taskbar__item--active'}" data-indexpage="2"><svg class="icon" xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24">
                            <path
                                d="M10.96 21q-.349 0-.605-.229q-.257-.229-.319-.571l-.263-2.092q-.479-.145-1.036-.454q-.556-.31-.947-.664l-1.915.824q-.317.14-.644.03t-.504-.415L3.648 15.57q-.177-.305-.104-.638t.348-.546l1.672-1.25q-.045-.272-.073-.559q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626l-1.672-1.25q-.275-.213-.338-.555t.113-.648l1.06-1.8q.177-.287.504-.406t.644.021l1.896.804q.448-.373.97-.673q.52-.3 1.013-.464l.283-2.092q.061-.342.318-.571T10.96 3h2.08q.349 0 .605.229q.257.229.319.571l.263 2.112q.575.202 1.016.463t.909.654l1.992-.804q.318-.14.645-.021t.503.406l1.06 1.819q.177.306.104.638t-.348.547L18.36 10.92q.082.31.092.569t.01.51q0 .233-.02.491q-.019.259-.088.626l1.69 1.27q.275.213.358.546t-.094.638l-1.066 1.839q-.176.306-.513.415q-.337.11-.654-.03l-1.923-.824q-.467.393-.94.673t-.985.445l-.264 2.111q-.061.342-.318.571t-.605.23zm.04-1h1.956l.369-2.708q.756-.2 1.36-.549q.606-.349 1.232-.956l2.495 1.063l.994-1.7l-2.189-1.644q.125-.427.166-.786q.04-.358.04-.72q0-.38-.04-.72t-.166-.747l2.227-1.683l-.994-1.7l-2.552 1.07q-.454-.499-1.193-.935q-.74-.435-1.4-.577L13 4h-1.994l-.312 2.689q-.756.161-1.39.52q-.633.358-1.26.985L5.55 7.15l-.994 1.7l2.169 1.62q-.125.336-.175.73t-.05.82q0 .38.05.755t.156.73l-2.15 1.645l.994 1.7l2.475-1.05q.589.594 1.222.953q.634.359 1.428.559zm.973-5.5q1.046 0 1.773-.727T14.473 12t-.727-1.773t-1.773-.727q-1.052 0-1.776.727T9.473 12t.724 1.773t1.776.727M12 12" />
                        </svg>
                        <div class="taskbar_item__title">Settings</div>
                    </li>
                    <!-- <li class="taskbar__item"><svg class="icon" xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 24 24">
                            <path
                                d="M11.5 4A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4m0-1a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3M11 17h1v2h-1zm.5-11A3.5 3.5 0 0 1 15 9.5c0 .9-.7 1.5-1.44 2.18l-.93.9c-.59.67-.66 1.95-.63 2.39V15h-1c0-.05-.1-1.96.87-3.08l1.03-.99c.6-.53 1.1-.98 1.1-1.43A2.5 2.5 0 0 0 11.5 7A2.5 2.5 0 0 0 9 9.5H8A3.5 3.5 0 0 1 11.5 6" />
                        </svg>
                        <div class="taskbar_item__title">Help</div>
                    </li> -->
                </ul>
            </section>
            <!--/. end taskbar-->
    `
}


export default connect()(taskbar)

export const taskbarEvents = function (event) {
    let taskbarItem = event.target.closest('.taskbar__item ');
    if (taskbarItem) {
        let indexPage = taskbarItem.dataset.indexpage;
        if (event.type === 'click') {
            dispatch('GOTOINDEXPAGE', indexPage);
            validaterForms(indexPage);

        }
    }
}
