 function html ([first, ...strings],...values)  {
    return values.reduce(
        (acc,cur) => acc.concat(cur, strings.shift()),
        [first])
        .filter(value => value&& value!==true||value ===0)
        .join('');
}

export function createStore(reducer) {
    let state = reducer();
    // để lưu trữ được key dưới dạng các kiểu dữ liệu của JS
    const roots = new Map();

    function render() {
        for (const [root, component] of roots) {
            const output = component();
            root.innerHTML = output;
        }
    }

    return {
        attach(component, root) {
            roots.set(root, component);
            render();
        },
        connect(selector = state => state) {
            return component =>(props, ...args) =>
                component(Object.assign({}, props, selector(state), ...args));
        },
        dispatch(action,...args) {
            state = reducer(state, action, args);
            render()
        }
    }

}
export const $ = document.querySelector.bind(document)
export const $s = document.querySelectorAll.bind(document)
export default html