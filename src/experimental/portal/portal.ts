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
    React.useEffect(() => {
        const node = { _node: children };
        bridge.mount(node);
        return () => bridge.unmount(node);
    }, [bridge, children]);
    return null;
};

export default Portal;
