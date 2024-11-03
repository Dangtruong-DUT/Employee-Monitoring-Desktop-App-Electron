// tìm cha ngoài cùng chứa cả thẻ input và errorMessage
export default function Validator (formSelector) {
    function getParent (element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    const formRules ={}

    /**
     * Quy ước tạo rules:
     * - nếu có lỗi thì return 'error message'
     * - nếu không có lỗi thì return 'undefined'
     */
    const validatorRules ={
        required(value) {
            return value ? undefined: "vui lòng nhập trường này";
        },
        email(value) {
            let regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // js email regrex || wildcart
            return value==''||regex.test(value)? undefined:'Trường này phải là email'
        },
        min(min,message) {
            return function (value) {
                return value.length >= min ? undefined:message||`Vui lòng nhập tối thiểu ${min} ký tự`
            }
        },
        max(max,message) {
            return function (value) {
                return value.length <= max ? undefined:message||`Vui lòng nhập tối đa ${max} ký tự`
            }
        },
        confirmed(tageName, message) {
            return function (value) {
                    const getConFirmValue = () => document.querySelector(`[name="${tageName}"]`).value;
                    return value === getConFirmValue()? undefined: message||'Giá trị nhập vào không chính xác'
                }
            }
    
    }

    // lấy form element
    const formElement = document.querySelector(formSelector);
    if (formElement) {
        const inputs = formElement.querySelectorAll("[name][rules]");
        for (let input of inputs) {
            let rules = input.getAttribute("rules").split("|");
            let ruleInfor;
            for (let rule of rules) {
                let isRuleHasValues = rule.includes(':')
               if (isRuleHasValues) {
                    ruleInfor = rule.split(':') 
                   // cắt rule với giá tri 
                   rule = ruleInfor[0];
               }
               let  ruleFunc = validatorRules[rule];
               if (isRuleHasValues) {
                    ruleFunc = ruleFunc(ruleInfor[1])
               }
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] =[ruleFunc]
                }
            }
            // lắng nghe sự kiênj
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        function handleValidate (event) {
            let rules = formRules[event.target.name];
            let erroMessage =false ;
            for (let rule of rules) {
                erroMessage=rule(event.target.value)
                if(erroMessage) break;

            }
            if (erroMessage) {
                let formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    let formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = erroMessage;
                    }
                }

            }
            return !erroMessage
        }
        function handleClearError (event) {
            let formGroup = getParent(event.target, '.form-group');
            if (formGroup) {
                formGroup.classList.remove('invalid');
                let formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
    
        // xử lý hành vi submitform 
        formElement.onsubmit = (e) =>{
            e.preventDefault();
            let isValid = true;
            const inputs = formElement.querySelectorAll("[name][rules]");
            for (let input of inputs) {
            if (!handleValidate({target:input})) {
                isValid = false;
            }
            }
            // khi không có lỗi thì submit form
            if (isValid) { 
                if (typeof this.onSubmit === 'function') {
                    let enableInput = formElement.querySelectorAll('[name]:not([disabled])')

                    let formValue = Array.from(enableInput).reduce(function(values, input){
                        switch (input.type) {
                            case 'file':
                                    values[input.name] = input.files
                                break
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value
                                }
                                break
                            case 'checkbox':
                            if (!input.matches(':checked')) {
                                    values[input.name] =''
                                    return values
                            }
                            if (!Array.isArray(values[input.name])) {
                                    values[input.name] =[]
                            }
                            values[input.name].push(input.value)
                                break
                            default:
                                values[input.name] = input.value
                                break;
                        }
                        return values
                    },{})
        
                    this.onSubmit(formValue)
                // nếu có hàm onSubmit thì gọi hàm này khi form đã đã validate thành công
                } else {
                    formElement.submit();  // nếu muốn submit form thì đánh dấu return false  và xử lý như bạn muốn
                }
            }
        }
    }
}