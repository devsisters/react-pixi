import React from 'react';
import type { Context, ReactNode } from 'react';

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
    sharedContextSet: Set<Context<unknown>>;
}

export interface BridgeOptions {
    sharedContext?: SingleOrArray<Context<unknown>>;
}

export function createBridge(root: Root, options: BridgeOptions = {}): Bridge {
    const {
        sharedContext = [],
    } = options;

    const contextSet = new Set(
        ([] as Context<unknown>[]).concat(sharedContext)
    );

    let childNodes: BridgeNode[] = [];
    return {
        get sharedContextSet() {
            return contextSet;
        },
        mount(node) {
            childNodes.push(node);
            root.render(
                childNodes.map(child => child._node)
            );
        },
        unmount(node) {
            childNodes = childNodes.filter(child => child !== node);
            root.render(
                childNodes.map(child => child._node)
            );
        },
    };
}
