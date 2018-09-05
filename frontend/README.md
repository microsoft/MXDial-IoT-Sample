FitBit Demo
=====================

This project is found in the `mx` package.
- `ionic`
- `mx`

Reusable components are found in the `common` package.

[Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) are being used to manage different packages in the same repo.

To install the monorepo: `yarn install`

Then, to start a package, move the specific package folder (e.g. `mv mx`) and run `yarn start`.

The `next` branch of [create-react-app supports workspaces](https://github.com/facebook/create-react-app/pull/3741)
which is what was used to bootstrap both react apps.
