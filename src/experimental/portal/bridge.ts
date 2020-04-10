import type { ReactNode } from 'react';

type Root = {
    render(element: ReactNode): void;
}

type BridgeNode = {
    _node: ReactNode;
};

export interface Bridge {
    mount(node: BridgeNode): void;
    unmount(node: BridgeNode): void;
}

export function createBridge(root: Root): Bridge {
    let childNodes: BridgeNode[] = [];
    return {
        mount(node) {
            childNodes.push(node);
            root.render(childNodes.map(child => child._node));
        },
        unmount(node) {
            childNodes = childNodes.filter(child => child !== node);
            root.render(childNodes.map(child => child._node));
        },
    };
}
