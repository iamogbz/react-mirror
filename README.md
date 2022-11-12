# React Mirror

<span><img alt="⚛️" align="right" width="144" height="144" src="./assets/logo.png"/></span>

[![NPM badge](https://img.shields.io/npm/v/react-mirror)](https://www.npmjs.com/package/react-mirror)
[![Dependabot badge](https://badgen.net/github/dependabot/iamogbz/react-mirror/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://img.shields.io/librariesio/github/iamogbz/react-mirror)](https://libraries.io/github/iamogbz/react-mirror)
[![Build Status](https://github.com/iamogbz/react-mirror/workflows/Build/badge.svg)](https://github.com/iamogbz/react-mirror/actions)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-mirror/badge.svg?branch=refs/heads/main)](https://coveralls.io/github/iamogbz/react-mirror)

Create synchronized replicas of a React DOM element

## Usage

See equivalent uses of the hook and component below.

### `useMirror` hook

```jsx
import { useMirror } from 'react-mirror';

function App() {
  const [ref, mirror] = useMirror({ className: 'mirror-frame' });
  return (
    <>
      <div ref={ref} />
      {mirror}
    </>
  );
}
```

### `<Mirror />` component

```jsx
import React from 'react';
import { Mirror } from 'react-mirror';

function App() {
  const [reflect, setReflect] = React.useState(null);
  return (
    <>
      <div ref={setReflect} />
      <Mirror reflect={reflect} className='mirror-frame' />
    </>
  );
}
```

### `<Window />` component

You can also render a reflection, with all the styles needed, in a separate window using the magic of [`Portals`](https://reactjs.org/docs/portals.html) 🌀

```jsx
import React from 'react';
import { FrameStyles, Reflection, Window } from 'react-mirror';

function App() {
  const [reflect, setReflect] = React.useState(null);
  return (
    <>
      <div ref={setReflect} />
      <Window>
        <FrameStyles />
        <Reflection real={reflect} style={{ pointerEvents: "none" }} />
      </Window>
    </>
  );
}
```

## Demos

### Using Portals

- [Live Preview](https://uwh7f.codesandbox.io/) ([codesandbox](https://codesandbox.io/s/react-mirror-uwh7f))([source](demo))
