import  Validator from '../utils/validator.js'
import {$s} from '../utils/core.js'

function handleForm(formObject) {

    Validator(formObject);
    
    $s('.form-control').forEach(input => {
        input.value!='' && ((input.nextElementSibling).style.display='block');
        input.addEventListener('blur', function() {
            const label = this.nextElementSibling;
            if (this.value !== '') {
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        });
        input.addEventListener('focus', function() {
            const label = this.nextElementSibling;
                label.style.display = 'block';
        });
    });
} 

export default handleForm