//  object validator constructor
export default function Validator (options) {
    
    // tìm cha ngoài cùng chứa cả thẻ input và errorMessage
    function getParent (element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }


    var selectorRules = {}

    // activity handle function of form coulded validate
    function validate(inputElement, rule) {
        var erroElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)    
        var errorMessage
        var rules = selectorRules [rule.selector]
        rules.some(test => {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    return errorMessage = test (
                        formElement.querySelector(rule.selector+':checked')
                     )
                default:
                    return errorMessage = test(inputElement.value)
            }
        })
        
        if (errorMessage) {
            erroElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            erroElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage
    }


    // lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault()
            var isFormValid = true
            options.rules.forEach(rule => {
                var inputElements = formElement.querySelectorAll(rule.selector) 
                var isValid
                Array.from(inputElements).forEach (inputElement =>{
                    isValid = validate(inputElement, rule)
                })

                if (!isValid) {
                    isFormValid = false
                }
            })

           
            if (isFormValid) {
                // submit with JS API
                if (typeof options.onSubmit === 'function') {

                    var enableInput = formElement.querySelectorAll('[name]:not([disabled])')

                    var formValue = Array.from(enableInput).reduce(function(values, input){
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
        
                    options.onSubmit(formValue)
                   
                } else {
                    //submit with html 
                    formElement.submit()
                }
            }


        }
       // lặp qua mỗi rule và lắng nghe sự khiện
        options.rules.forEach(rule => {
            // save all rules for each turn
            if (Array.isArray(selectorRules[rule.selector])) {

                selectorRules[rule.selector]. push (rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            var inputElements = formElement.querySelectorAll(rule.selector) 
            
            Array.from(inputElements).forEach (inputElement =>{
                if (inputElement) {
                    //xử lý trường hợp blur
                   // inputElement.onblur = function () {
                   //     validate(inputElement, rule)
                    //}
                    inputElement.oninput = function () {
                        var erroElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)    
                        erroElement.innerText = ''
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                    }
                    inputElement.onchange = function () {
                        var erroElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)    
                        erroElement.innerText = ''
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                    }
                }
            })
        });
    }

}

//rules
Validator.isRequired =function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            return (value||(typeof value =='string' &&value.trim()))?undefined: message||'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            var regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // js email regrex || wildcart
            return value==''||regex.test(value)? undefined: message|| 'Trường này phải là email'
        }
    }
}
Validator.minLegth = function (selector,min,message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined:message||`Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function (selector, getConFirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConFirmValue()? undefined: message||'Giá trị nhập vào không chính xác'
        }
    }
}