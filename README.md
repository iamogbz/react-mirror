# React Mirror

<span><img alt="⚛️" align="right" width="144" height="144" src="./assets/logo.png"/></span>

[![NPM badge](https://img.shields.io/npm/v/react-mirror)](https://www.npmjs.com/package/react-mirror)
[![Dependabot badge](https://badgen.net/dependabot/iamogbz/react-mirror/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://david-dm.org/iamogbz/react-mirror.svg)](https://github.com/iamogbz/react-mirror)
[![Build Status](https://github.com/iamogbz/react-mirror/workflows/Build/badge.svg)](https://github.com/iamogbz/react-mirror/actions)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-mirror/badge.svg?branch=master)](https://coveralls.io/github/iamogbz/react-mirror?branch=master)

Create synchronized replicas of a React DOM element

## Usage

### `useMirror` hook

```jsx
import { useMirror } from 'react-mirror';

function App() {
  const [ref, reflection] = useMirror();
  return (
    <>
      <div ref={ref} />
      {reflection}
    <>
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
      <Mirror reflect={reflect}/>
    <>
  );
}
```

## Demos

### [Using Portals](https://uwh7f.codesandbox.io/)
