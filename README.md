# React PIXI + Concurrent React = ?

![license](https://img.shields.io/badge/license-MIT-green.svg)
![@devsisters/react-pixi](https://img.shields.io/badge/%40inlet%2Freact--pixi-v1.2.12-blue)
![react](https://img.shields.io/badge/react-v0.0.0--experimental--d7382b6c4-orange)
![react-dom](https://img.shields.io/badge/react--dom-v0.0.0--experimental--d7382b6c4-orange)

Write [PIXI](http://www.pixijs.com/) applications using React declarative style 👌
![logo](https://user-images.githubusercontent.com/17828231/61295022-6ffa6980-a7d7-11e9-9bff-e71670156cca.png)

## About this fork

This fork supports exactly same APIs with upstream and have some experimental features to bring the power of [Concurrent React](https://reactjs.org/docs/concurrent-mode-intro.html)

This only for internal research. use at your own risk.

## Install

```bash
yarn add pixi.js @devsisters/react-pixi
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

TODO

### Suspense for resource loader

WIP

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

### UI Toolkit

TODO

### Motion Toolkit

WIP
