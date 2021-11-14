export function walk(node, callback) {
    if (typeof node.type === "function") {
        const name = node.type.name;
        callback(name, node);
    } else if (node.type && typeof node.type === "object") {
        if (node.type.render) {
            const name = node.type.render.displayName;
            callback(name, node);
        } else if (node.type._context) {
            // skip contexts
        }
    } else if (typeof node.type === "string") {
        const name = node.type;
        callback(name, node);
    }

    if (node.child) {
        walk(node.child, callback);
    }
    if (node.sibling) {
        walk(node.sibling, callback);
    }
}

export const getElements = (root) => {
    const elements = [];
    walk(root, (name, node) => {
        const {children, ...props} = node.memoizedProps;
        const state = [];
        let memoizedState = node.memoizedState;
        while (memoizedState) {
            // TODO: figure out how to get the names of the state
            state.push(memoizedState.memoizedState);
            memoizedState = memoizedState.next;
        }
        elements.push({
            name, props, state,
        });
    });
    return elements;
};
