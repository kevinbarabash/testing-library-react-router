import {Switch} from "react-router-dom";
export function walk(node, callback) {
    if (typeof node.type === "function") {
        const name = node.type.name;
        const component = node.type;
        callback(node, name, component);
    } else if (node.type && typeof node.type === "object") {
        if (node.type.render) {
            const name = node.type.displayName;
            callback(node, name);
        } else if (node.type._context) {
            // skip contexts
        }
    } else if (typeof node.type === "string") {
        const name = node.type;
        callback(node, name);
    } else {
        // text node
        const {stateNode, return: returnVal, sibling, ...rest} = node;
    }

    if (node.child) {
        walk(node.child, callback);
    }
    if (node.sibling) {
        walk(node.sibling, callback);
    }
}

export const getElements = (container) => {
    const [fiberKey] = Object.keys(container.firstElementChild);
    const fiber = container.firstElementChild[fiberKey];
    const elements = [];
    walk(fiber, (node, name, component) => {
        const {children, ...props} = node.memoizedProps;
        const state = [];
        let memoizedState = node.memoizedState;
        while (memoizedState) {
            // TODO: figure out how to get the names of the state
            state.push(memoizedState.memoizedState);
            memoizedState = memoizedState.next;
        }
        elements.push({
            name, props, state, component,
        });
    });
    return elements;
};
