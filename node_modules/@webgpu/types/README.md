# Typescript Type Definitions for WebGPU

This package defines Typescript types (`.d.ts`) for the upcoming [WebGPU standard](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status).

_This package matches the work-in-progress WebGPU API, which is **currently unstable!**_

Use this package to augment the ambient [`"dom"`](https://www.typescriptlang.org/docs/handbook/compiler-options.html#compiler-options) type definitions with the new definitions for WebGPU.


## What are declaration files?

See the [TypeScript handbook](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).


## How can I use them?

### Install

- npm: `npm install --save @webgpu/types`
- yarn: `yarn add @webgpu/types`

### Configure

#### TypeScript `tsc` and `tsc`-based bundlers

In `tsconfig.json`:

```js
{
  // ...
  "compilerOptions": {
    // ...
    "typeRoots": [ "./node_modules/@webgpu/types", "./node_modules/@types"]
  }
}
```

#### Webpack

In `webpack.config.js` add:

```js
"types": ["@webgpu/types"]
```

(may not be necessary with `tsc` config above - untested)

#### Inline in TypeScript

```ts
/// <reference types="@webgpu/types" />
```

#### Others?

Please contribute a PR to add instructions for other setups or improve existing instructions. :)


## How to update these types

- Make sure the submodule is checked out: `git submodule update --init`
- Pull `gpuweb` changes: `pushd gpuweb && git checkout main && git pull && popd`
- Install dependencies: `npm ci`
- Generate `generated/index.d.ts`: `npm run generate`
- Open a diff between `generated/index.d.ts` and `dist/index.d.ts`.
    The generated file is tracked by Git so you can see what has changed.
    Update the latter according to changes from the former.
    Note the `generated/` and `dist/` files are not the same.
    See below for intentional differences.
- Format the result: `npm run format`

### Intentional differences between generator output and final result

Most or all of these should be fixed in the generator over time.

- `Array` changed to `Iterable` for WebIDL `sequence`s in argument positions.
- `any` changed to `object` for WebIDL `object`.
- `| SharedArrayBuffer` added for `[AllowShared] BufferSource`.

The following differences are TODO: should be changed in the final result.

- Deprecated items should be removed.

The following differences will remain.

- `onuncapturederror` strongly typed.
- `getContext` definitions.
- `GPUExtent3DStrict` (and similar).

### Publish a new npm package version

(only for people who have npm publish access)

* One line cmd to copy-n-paste (for ssh git user, and you'd better know what you are doing, if it failed at certain steps, you might need to clean up git tags before trying again)
  - `git checkout main && git pull git@github.com:gpuweb/types.git main && git submodule update --init && npm version patch && git push git@github.com:gpuweb/types.git main --tags && npm publish`
* Separate steps (better for publishing for the first time)
  * Make sure you are in the upstream repo, not your forked one. And make sure you are synced to latest commit intended for publish
    - `git checkout main`
    - `git pull https://github.com/gpuweb/types.git main`
      - (If you are using HTTPS regularly. You can use remote names like `origin`, just make sure you are referring to the right repo)
    - `git submodule update --init`
  * Create the version tag and commit, and push
    - `npm version patch`
    - `git push https://github.com/gpuweb/types.git main --tags`
  * publish the package
    - `npm publish --otp=<code>`
      - Replace `<code>` with the one-time password from your authenticator, since two-factors authentication is required to publish.
      - If you are doing for the first time, you will do `npm adduser` first and it will guide you through adding the npm account.

