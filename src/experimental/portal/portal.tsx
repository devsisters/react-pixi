import React from 'react';

import type { Bridge } from './bridge';

interface PortalProps {
    bridge: Bridge;
    children?: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({
    bridge,
    children,
}) => {
    const sharedContextSet = bridge.sharedContextSet;

    const providers: JSX.Element[] = [];
    for (const Context of sharedContextSet) {
        const contextValue = readContext(Context);
        const element = <Context.Provider value={contextValue}/>;
        providers.push(element);
    }

    const wrapProviders = (node: React.ReactNode) => {
        let last: React.ReactNode = node;
        for (const Provider of providers) {
            last = React.cloneElement(Provider, { children: last });
        }
        return last;
    };

    React.useEffect(() => {
        const node = { _node: wrapProviders(children) };
        bridge.mount(node);
        return () => bridge.unmount(node);
    }, [bridge, children]);

    return null;
};

export default Portal;

const ReactCurrentDispatcher =
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        .ReactCurrentDispatcher;

function readContext<T>(Context: React.Context<T>, observedBits?: number) {
    const dispatcher = ReactCurrentDispatcher.current;
    if (dispatcher === null) {
        throw new Error(
            'react-pixi: readContext only be called in component render',
        );
    }
    return dispatcher.readContext(Context, observedBits);
}
