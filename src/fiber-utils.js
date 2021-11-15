/**
 * Utilities for walking fiber trees and getting a list of React nodes.
 */
// Copied from https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/shared/ReactWorkTags.js
const FunctionComponent = 0;
const ClassComponent = 1;
const IndeterminateComponent = 2; // Before we know whether it is function or class
const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
const HostComponent = 5; // HTML tags, e.g. <div>, <span>, etc.
const HostText = 6;
const Fragment = 7;
const Mode = 8; // e.g. concurrent mode, strict mode
const ContextConsumer = 9;
const ContextProvider = 10;
const ForwardRef = 11;
const Profiler = 12;
const SuspenseComponent = 13;
const MemoComponent = 14;
const SimpleMemoComponent = 15;
const LazyComponent = 16;

export function walk(node, callback) {
    // TODO: handle more node types
    switch (node.tag) {
        case FunctionComponent:
        case ClassComponent: {
            const name = node.type.name;
            const component = node.type;
            callback(node, name, component);
            break;
        }
        case HostComponent: {
            const name = node.type;
            const component = undefined;
            callback(node, name, component);
            break;
        }
    }

    if (node.child) {
        walk(node.child, callback);
    }
    if (node.sibling) {
        walk(node.sibling, callback);
    }
}

export const getComponentNodes = (container) => {
    const fiberRoot = container._reactRootContainer._internalRoot;
    const fiber = fiberRoot.current;
    const nodes = []; // React nodes

    walk(fiber, (node, name, component) => {
        const {children, ...props} = node.memoizedProps;
        let state = null;

        if (node.tag === FunctionComponent) {
            const memoizedStates = [];
            let memoizedState = node.memoizedState;
            while (memoizedState) {
                // TODO: figure out how to get the names of the state
                memoizedStates.push(memoizedState.memoizedState);
                memoizedState = memoizedState.next;
            }
            if (memoizedStates.length > 0) {
                state = memoizedStates;
            }
        } else if (node.tag === ClassComponent) {
            state = node.memoizedState;
        }

        nodes.push({
            name, props, state, component,
        });
    });

    return nodes;
};
