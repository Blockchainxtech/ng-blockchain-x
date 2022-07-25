---
sidebar_position: 1
---

# Getting started

### Install npm package 

```js
npm i ng-blockchainx
```


If you are using Angular version >11 and run into an issue building. This is because polyfills are not included in the newest version of Angular.

- Install the required dependencies within your angular project:

```bash
npm install --save-dev crypto-browserify next-tick stream-browserify assert stream-http https-browserify os-browserify
```

- Within `tsconfig.json` add the following `paths` in `compilerOptions` so Webpack can get the correct dependencies

```typescript
{
    "compilerOptions": {
        "paths" : {
        "crypto": ["./node_modules/crypto-browserify"],
        "stream": ["./node_modules/stream-browserify"],
        "assert": ["./node_modules/assert"],
        "http": ["./node_modules/stream-http"],
        "https": ["./node_modules/https-browserify"],
        "os": ["./node_modules/os-browserify"],
    }
}
```

- Add the following lines to `polyfills.ts` file:

```typescript
import { Buffer } from 'buffer';

(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
} as any;
```

- Create webpack.config.js file on root path and add below code 

```js

{
    resolve: {
        fallback: {
            url: require.resolve("url/")
        }
    }
}

```

after run npm install url

Once above setup done stop and start the angular project. If compilation success start integrating the services.
