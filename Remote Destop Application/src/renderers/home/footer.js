import * as Imports from '../../js/import.js';
const {connect, html } = Imports;

function footer({States}) {
    return html`
         <!--footer state online cho bt rang dang ở trạng thái sẵn sàng connect-->
                <footer class="hompage__footer grid__row ">
                    <div class="stateConnect">
                        <div class="stateConnect__state ${States.isOnline &&'state--online'}"></div>
                        <div class="stateconnect__titleconnect">
                            ${States.isOnline &&'Ready to connect (secure connection)'||'Not ready. Please check your connection'}</div>
                    </div>
                </footer>
        <!--/. end footer-->
    `
 
}

export default connect()(footer)