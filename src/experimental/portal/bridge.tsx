import React from 'react';
import type { Context, ReactNode } from 'react';

const ReactCurrentDispatcher =
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        .ReactCurrentDispatcher;

function readContext<T>(Context: React.Context<T>, observedBits?: number) {
    const dispatcher = ReactCurrentDispatcher.current;
    if (dispatcher === null) {
        throw new Error(
            'react-pixi: render through bridge may only be called from within a ' +
            "component's render. They are not supported in event handlers or " +
            'lifecycle methods.',
        );
    }
    return dispatcher.readContext(Context, observedBits);
}

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

    const wrapProviders = (node: ReactNode) => {
        const providers: JSX.Element[] = [];
        for (const Context of contextSet) {
            const contextValue = readContext(Context);
            const element = <Context.Provider value={contextValue}/>;
            providers.push(element);
        }

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
