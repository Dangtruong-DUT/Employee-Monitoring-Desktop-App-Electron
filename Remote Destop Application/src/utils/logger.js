export default function logger(reducer) {

    return (prevState, action, args) => {
        console.group(action);
        console.log('Previous State:', prevState);
        console.log('Action:', action);
        console.log('Arguments:', args);
        const nextState =  reducer(prevState, action, args);
        console.log('Next State:', nextState);
        console.groupEnd(action);
        return nextState
    }
};