# React PIXI + Concurrent React = ?

![license](https://img.shields.io/badge/license-MIT-green.svg)
![@inlet/react-pixi](https://img.shields.io/badge/%40inlet%2Freact--pixi-v2.0.1-blue)
![react](https://img.shields.io/badge/react-v0.0.0--experimental--e5d06e34b-orange)
![react-dom](https://img.shields.io/badge/react--dom-v0.0.0--experimental--e5d06e34b-orange)

Write [PIXI](http://www.pixijs.com/) applications using React declarative style 👌
![logo](https://user-images.githubusercontent.com/17828231/61295022-6ffa6980-a7d7-11e9-9bff-e71670156cca.png)

## About this fork

This fork supports exactly same APIs with upstream and have some experimental features to bring the power of [Concurrent React](https://reactjs.org/docs/concurrent-mode-intro.html)

This only for internal research. use at your own risk.

## Install

```bash
yarn add \
  pixi.js \
  @devsisters/react-pixi@experimental \
  react@experimental \
  react-dom@experimental
```

## Features

### Enable Concurrent Mode (with ReactDOM)

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM
.createRoot(document.getElementById('root'))
.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
```

### Enable Concurrent Mode (without ReactDOM)

TBD

### Suspense for resource loader

TBD

Since the resource-loader has its own lifecycle, It's necessary to build a  scheduler to integrate with the React lifecycle. More exploration needed for better API design. However, It's not going to be right now because I'm currently using an optimized spritesheet.

Example)

```jsx
import React from 'react';
import { AnimatedSprite, TilingSprite } from '@devsisters/react-pixi';
import { createResource, ResourceType } from '@devsisters/react-pixi/experimental';

const BackgroundTextureResource = createResource({
  id: 'my-texture',
  type: ResourceType.TEXTURE,
  path: 'path/to/resource.jpg',
});

const CharacterFramesResource = createResource({
  id: 'my-texture',
  type: ResourceType.SPRITE_SHEET,
  path: 'path/to/resource.json',
});

const Playground: React.FC = () => {
  const backgroundTexture = BackgroundTextureResource.read();
  const characterFrames = CharacterFramesResource.read();

  return (
    <>
      <TilingSprite
        texture={backgroundTexture}
        {...}
      />
      <AnimatedSprite
        frames={characterFrames}
        {...}
      />
    </>
  )
};

// Don't forget to wrap the component using `<React.Suspense>`
import React from 'react';
import { Stage, Text } from '@devsisters/react-pixi';

import Playground from './Playground';

const App: React.FC = () => {
  return (
    <Stage>
      <ErrorBoundary>
        <React.Suspense fallback={<Text text="loading..."/>}>
          <Playground/>
        </React.Suspense>
      </ErrorBoundary>
    </Stage>
  );
};
```

### UI Portal

Use custom portal for external React root.

You can build UI in exist ReactDOM!

Example:

```tsx
import ReactDOM from 'react-dom';
import { createBridge } from '@devsisters/react-pixi';

// Context can be shared between react-pixi and ReactDOM via the bridge.
const ValueContext = React.createContext(0);

const uiRoot = ReactDOM.createRoot(
  document.getElementById('ui-root')!
);

/**
 * Create a bridge to communicate with external react root.
 * You can use not only ReactDOM root here, but also anything satisfy the interface:
 * ```tsx
 * interface Root {
 *   render(node: React.ReactNode): void;
 * }
 * ```
 */
const uiBridge = createBridge(uiRoot, {
  // Only specified shared context here automatically forwarded to the outside root.
  sharedContext: [
    ValueContext,
  ],
});

```

```tsx
import { Portal } from '@devsisters/react-pixi';

// In the <Stage> ...
<Stage>
  <Text text="Hello ReactPIXI!!!">
  <Portal bridge={uiBridge}>
    <div>Now you can use ReactDOM here!!</div>
  </Portal>

  <Container>
    <Portal bridge={uiBridge}>
      <div>
        Even in a nested containers, just same as ReactDOM's Portal
      </div>
    </Portal>
  </Container>
</Stage>
```

### Animations

TBD

Note: There are some existing great animation engines. However, there are some problems to use as it is.

- API is too low-level... Or
- API strongly coupled to DOM
- Using a separate ticker internally

it will take some time to get a sufficiently high-level API with solving these problems. What I currently considering is building react hooks to integrate popmotion-pure to get an API similar to framer-motion or react-spring but only for populating values.

Popmotion uses a separate ticker "framesync" internally, and has a preemptive competition with PIXI.js, which causes synchronization problems in low-performance environments. After leveraging Popmotion's high-level API, I need to replace the underlying engine to be customizable.
