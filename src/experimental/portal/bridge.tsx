import React from 'react';
import type { Context, ReactNode } from 'react';

const ReactCurrentDispatcher =
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        .ReactCurrentDispatcher;

type Root = {
    render(element: ReactNode): void;
}

type BridgeNode = {
    _node: ReactNode;
};

type SingleOrArray<T> = T | Array<T>;

export interface Bridge {
    mount(node: BridgeNode): void;
    unmount(node: BridgeNode): void;
}

export interface BridgeOptions {
    sharedContext?: SingleOrArray<Context<unknown>>;
}

export function createBridge(root: Root, options: BridgeOptions = {}): Bridge {
    const {
        sharedContext = [],
    } = options;

    const contextSet = new Set(([] as Context<unknown>[]).concat(sharedContext));
    const providers: JSX.Element[] = [];
    for (const Context of contextSet) {
        const contextValue = ReactCurrentDispatcher.readContext(Context);
        const element = <Context.Provider value={contextValue}/>;
        providers.push(element);
    }
    const wrapProviders = (node: ReactNode) => {
        let last: ReactNode = node;
        for (const Provider of providers) {
            last = React.cloneElement(Provider, { children: last });
        }
        return last;
    };

    let childNodes: BridgeNode[] = [];
    return {
        mount(node) {
            childNodes.push(node);
            root.render(
                wrapProviders(childNodes.map(child => child._node))
            );
        },
        unmount(node) {
            childNodes = childNodes.filter(child => child !== node);
            root.render(
                wrapProviders(childNodes.map(child => child._node))
            );
        },
    };
}
