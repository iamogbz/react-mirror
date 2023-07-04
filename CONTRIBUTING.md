# Contributing

:tada: Thanks for taking the time to contribute! :tada:

The following is a set of guidelines for contributing to this [repo](https://github.com/iamogbz/react-mirror).
These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)

- [GNU Make and Bash](#make-and-bash)

[How Can I Contribute?](#how-can-i-contribute)

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)

[Styleguides](#styleguides)

- [Commit Messages](#commit-messages)
- [Code Styleguide](#code-styleguide)
## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## What should I know before I get started?


- [Makefiles][makefiles]
- [Bourne Again Shell](bashscript)
- [Typescript][typescript]
- [Jest Test Framework][jest]

## How Can I Contribute?

### Reporting Bugs

Create a bug report [issue][bug-report]

### Suggesting Enhancements

Create a feature request [issue][feat-request]

### Your First Code Contribution

#### Local development

Install dependencies using the package node version.

```sh
[react-mirror]$ nvm use
[react-mirror]$ npm i -g pnpm
[react-mirror]$ pnpm i
```

##### Testing

NPM package source code is located in `./src` with tests in the same folder.

Add [jest style][jest] tests for new changes.

```sh
[react-mirror]$ pnpm test
```

##### Validating

After [setup](#setup), build changes to NPM package source code, then run `demo` app to validate local dev `react-mirror`.

```sh
[react-mirror]$ pnpm build
[react-mirror]$ cd ./demo 
[react-mirror/demo]$ make start
```

__NOTE__: Use `pnpm build-watch` instead to watch code changes when in active development.

### Pull Requests

After validating your [changes](#validating) and adding [tests](#testing), push commits to a new branch and create a pull request using the provided GitHub template.

## Styleguides

### Git Commit Messages

Package using semantic [commits convention][conventional-commits].

```sh
git commit -m "fix: that one bug" -m "implementation details"
```

See the link above or [commits](../../commits) in the repo for more examples.

### Code Styleguide

Post [install](#local-development) gives you access to the linter and static [type][typescript] checker.

```sh
[react-mirror]$ pnpm lint
[react-mirror]$ pnpm typecheck
```

<!-- LINKS -->

[bashscript]: https://www.gnu.org/software/bash/manual/html_node/index.html#Top
[bug-report]: https://github.com/iamogbz/react-mirror/issues/new?assignees=&labels=&projects=&template=bug_report.md
[feat-request]: https://github.com/iamogbz/react-mirror/issues/new?assignees=&labels=&projects=&template=feature_request.md
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[makefiles]: https://www.gnu.org/software/make/manual/html_node/Introduction.html
[jest]: https://jestjs.io/
[typescript]: https://www.typescriptlang.org/