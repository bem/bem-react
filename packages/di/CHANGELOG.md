# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.8...@bem-react/di@3.0.0) (2021-06-22)

### Features

- **di:** make di able to keep anything ([e302953](https://github.com/bem/bem-react/commit/e30295305e133ba240e5dc691eb80ab04199c12e))

### BREAKING CHANGES

- **di:** `HOC` and `IRegistryComponents` aren't exported from di, and generic-param for `Registry.set` has different meaning

## [2.2.8](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.7...@bem-react/di@2.2.8) (2021-06-21)

### Bug Fixes

- **di:** expose IRegistryComponents type ([d32a0a7](https://github.com/bem/bem-react/commit/d32a0a7e24f5082943a7b9d854f00a17437de8fe))

## [2.2.7](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.6...@bem-react/di@2.2.7) (2021-06-08)

### Bug Fixes

- update pkg ([1ccdee8](https://github.com/bem/bem-react/commit/1ccdee8d9c4c09a02f888ee880a332ac75b725fd))

## [2.2.6](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.5...@bem-react/di@2.2.6) (2021-04-27)

### Bug Fixes

- **di:** supports react@17 ([0c19c61](https://github.com/bem/bem-react/commit/0c19c6135a0fdbbf82dcb808f745b57320dbad76))

## [2.2.5](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.4...@bem-react/di@2.2.5) (2020-11-13)

### Bug Fixes

- **di:** fixed merge of registries with same id ([0706c4a](https://github.com/bem/bem-react/commit/0706c4ad5117c3107df24d42abe8b67eebbec30c))

## [2.2.4](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.3...@bem-react/di@2.2.4) (2020-04-02)

### Bug Fixes

- **di:** resolve [#551](https://github.com/bem/bem-react/issues/551) issue ([c4491a4](https://github.com/bem/bem-react/commit/c4491a44268bd61ec77316208b918c03abea65c8))

## [2.2.3](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.2...@bem-react/di@2.2.3) (2020-03-12)

### Performance Improvements

- **di:** use for of loop instead forEach ([68d239c](https://github.com/bem/bem-react/commit/68d239c3f537a7203a9d8644a81ab4623fedb2eb))
- **di:** use native createElement instead jsx ([eb3ff64](https://github.com/bem/bem-react/commit/eb3ff6461a1eaa0558df0ab3aebf32a302a35a77))

## [2.2.2](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.1...@bem-react/di@2.2.2) (2020-03-02)

### Bug Fixes

- **di:** fixes a way to extends components ([629b2a5](https://github.com/bem/bem-react/commit/629b2a508d92997b30a2f7a9342b2f0fd4337e4b))

### Performance Improvements

- **di:** improving performance ([469966f](https://github.com/bem/bem-react/commit/469966f01f4c11f27971625d8681f38beabcd773))

## [2.2.1](https://github.com/bem/bem-react/compare/@bem-react/di@2.2.0...@bem-react/di@2.2.1) (2019-12-27)

### Bug Fixes

- **di:** Add errors when base component is empty for extending component ([8595d01](https://github.com/bem/bem-react/commit/8595d01194ae00af4216a5d5824205c62d1e1161))

# [2.2.0](https://github.com/bem/bem-react/compare/@bem-react/di@2.1.0...@bem-react/di@2.2.0) (2019-12-23)

### Features

- **di:** Add withBase-hoc as a way of extending components ([dda4d8b](https://github.com/bem/bem-react/commit/dda4d8b22325331a46e19dad75dae7da5a388aed))

# [2.1.0](https://github.com/bem/bem-react/compare/@bem-react/di@2.0.4...@bem-react/di@2.1.0) (2019-12-02)

### Features

- **di:** fill registry with components via object literal ([a4f69c5](https://github.com/bem/bem-react/commit/a4f69c5c12e4bdf31c66994174d75fd82bc76674))

## [2.0.4](https://github.com/bem/bem-react/compare/@bem-react/di@2.0.3...@bem-react/di@2.0.4) (2019-10-02)

**Note:** Version bump only for package @bem-react/di

## [2.0.3](https://github.com/bem/bem-react/compare/@bem-react/di@2.0.2...@bem-react/di@2.0.3) (2019-08-20)

**Note:** Version bump only for package @bem-react/di

## [2.0.2](https://github.com/bem/bem-react/compare/@bem-react/di@2.0.1...@bem-react/di@2.0.2) (2019-07-31)

**Note:** Version bump only for package @bem-react/di

## [2.0.1](https://github.com/bem/bem-react/compare/@bem-react/di@2.0.0...@bem-react/di@2.0.1) (2019-05-27)

### Bug Fixes

- **di:** return type in GetNonDefaultProps without GetNonDefaultProps ([9f3ab8e](https://github.com/bem/bem-react/commit/9f3ab8e))

# [2.0.0](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.6.0...@bem-react/di@2.0.0) (2019-05-24)

### Features

- **di:** replace inverted by overridable ([957a0fe](https://github.com/bem/bem-react/commit/957a0fe))

### BREAKING CHANGES

- **di:** Set inverted flag by default and rename it to "overridable".

# [1.6.0](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.5.3...@bem-react/di@1.6.0) (2019-04-22)

### Features

- **di:** add hooks for registries and registryComponent ([c512dc2](https://github.com/bem/bem-react/commit/c512dc2))

## [1.5.3](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.5.2...@bem-react/di@1.5.3) (2019-03-01)

### Bug Fixes

- **di:** registers are overwritten in context ([a7b6377](https://github.com/bem/bem-react/commit/a7b6377))

## [1.5.2](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.5.1...@bem-react/di@1.5.2) (2019-01-29)

### Bug Fixes

- **di:** remove global variable providedRegistries ([8f5e93e](https://github.com/bem/bem-react/commit/8f5e93e))

## [1.5.1](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.5.0...@bem-react/di@1.5.1) (2019-01-16)

### Bug Fixes

- **di:** provided registries must be global ([57fdb8b](https://github.com/bem/bem-react/commit/57fdb8b))

# [1.5.0](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.4.0...@bem-react/di@1.5.0) (2019-01-10)

### Features

- **di:** partially registries merge ([7890e03](https://github.com/bem/bem-react/commit/7890e03))

# [1.4.0](https://github.com/bem/bem-react/tree/master/packages/di/compare/@bem-react/di@1.3.0...@bem-react/di@1.4.0) (2018-12-28)

### Features

- **di:** the way to add typings for registry result ([b76e4e1](https://github.com/bem/bem-react/commit/b76e4e1))

# 1.3.0 (2018-12-21)

### Bug Fixes

- **di:** correct typings for withRegistry ([a79eca2](https://github.com/bem/bem-react/commit/a79eca2))
- **di:** return correct type from withRegistry ([e695088](https://github.com/bem/bem-react/commit/e695088))
- **di:** use map as class option for using in es5 ([24e9015](https://github.com/bem/bem-react/commit/24e9015))

### Features

- **v3:** init packages ([d652328](https://github.com/bem/bem-react/commit/d652328))

## 1.2.2 (2018-12-21)

### Bug Fixes

- **di:** correct typings for withRegistry ([a79eca2](https://github.com/bem/bem-react/commit/a79eca2))
- **di:** return correct type from withRegistry ([e695088](https://github.com/bem/bem-react/commit/e695088))
- **di:** use map as class option for using in es5 ([24e9015](https://github.com/bem/bem-react/commit/24e9015))

### Features

- **v3:** init packages ([d652328](https://github.com/bem/bem-react/commit/d652328))

## 1.2.1 (2018-12-19)

### Bug Fixes

- **di:** correct typings for withRegistry ([a79eca2](https://github.com/bem/bem-react/commit/a79eca2))
- **di:** return correct type from withRegistry ([4e09616](https://github.com/bem/bem-react/commit/4e09616))
- **di:** use map as class option for using in es5 ([24e9015](https://github.com/bem/bem-react/commit/24e9015))

### Features

- **v3:** init packages ([d652328](https://github.com/bem/bem-react/commit/d652328))

# 1.2.0 (2018-12-18)

### Bug Fixes

- **di:** correct typings for withRegistry ([ce73d79](https://github.com/bem/bem-react/commit/ce73d79))
- **di:** use map as class option for using in es5 ([24e9015](https://github.com/bem/bem-react/commit/24e9015))

### Features

- **v3:** init packages ([d652328](https://github.com/bem/bem-react/commit/d652328))

# 1.1.0 (2018-12-06)

### Bug Fixes

- **di:** use map as class option for using in es5 ([24e9015](https://github.com/bem/bem-react/commit/24e9015))

### Features

- **v3:** init packages ([d652328](https://github.com/bem/bem-react/commit/d652328))

<a name="1.0.2"></a>

## [1.0.2](https://github.com/bem/bem-react-core/compare/@bem-react/di@1.0.1...@bem-react/di@1.0.2) (2018-10-24)

**Note:** Version bump only for package @bem-react/di

<a name="1.0.1"></a>

## [1.0.1](https://github.com/bem/bem-react-core/compare/@bem-react/di@0.2.4...@bem-react/di@1.0.1) (2018-10-02)

### Bug Fixes

- **di:** use map as class option for using in es5 ([7fd489f](https://github.com/bem/bem-react-core/commit/7fd489f))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/bem/bem-react-core/compare/@bem-react/di@0.2.4...@bem-react/di@1.0.0) (2018-09-20)

**Note:** Version bump only for package @bem-react/di

<a name="0.2.4"></a>

## [0.2.4](https://github.com/bem/bem-react-core/compare/@bem-react/di@0.2.3...@bem-react/di@0.2.4) (2018-09-13)

**Note:** Version bump only for package @bem-react/di

<a name="0.2.3"></a>

## [0.2.3](https://github.com/bem/bem-react-core/compare/@bem-react/di@0.2.2...@bem-react/di@0.2.3) (2018-08-30)

**Note:** Version bump only for package @bem-react/di

<a name="0.2.2"></a>

## [0.2.2](https://github.com/bem/bem-react-core/compare/@bem-react/di@0.2.1...@bem-react/di@0.2.2) (2018-08-29)

**Note:** Version bump only for package @bem-react/di

<a name="0.2.1"></a>

## [0.2.1](https://github.com/bem/bem-react-core/compare/@bem-react/di@0.2.0...@bem-react/di@0.2.1) (2018-08-29)

**Note:** Version bump only for package @bem-react/di

<a name="0.2.0"></a>

# 0.2.0 (2018-08-29)

### Features

- **v3:** init packages ([b192fc5](https://github.com/bem/bem-react-core/commit/b192fc5))

<a name="0.1.0"></a>

# 0.1.0 (2018-08-29)

### Features

- **v3:** init packages ([b192fc5](https://github.com/bem/bem-react-core/commit/b192fc5))
