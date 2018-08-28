# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.2.3"></a>
## [2.2.3](https://github.com/bem/bem-react-core/compare/bem-react-core@2.2.2...bem-react-core@2.2.3) (2018-08-08)


### Bug Fixes

* change & to | for resulting interface of withMods ([06936a4](https://github.com/bem/bem-react-core/commit/06936a4))
* declare props in base mod as any ([a0b6428](https://github.com/bem/bem-react-core/commit/a0b6428))




<a name="2.2.2"></a>
## 2.2.2 (2018-08-01)


### Bug Fixes

* remove unneded context arg ([3f50345](https://github.com/bem/bem-react-core/commit/3f50345))
* right mod value type and className generation ([7fa80f7](https://github.com/bem/bem-react-core/commit/7fa80f7))



<a name="2.2.1"></a>
## 2.2.1 (2018-07-26)


### Bug Fixes

* **package:** move assert libs to prod dependencies ([6fe425c](https://github.com/bem/bem-react-core/commit/6fe425c))
* move naming preset to dynamic field ([92f069f](https://github.com/bem/bem-react-core/commit/92f069f))



<a name="2.2.0"></a>
# 2.2.0 (2018-07-26)


### Features

* **utils:** add assert helpers ([683270f](https://github.com/bem/bem-react-core/commit/683270f))
* add attach forward ref ([babab12](https://github.com/bem/bem-react-core/commit/babab12))
* remove blockName and elemName methods ([88f432e](https://github.com/bem/bem-react-core/commit/88f432e))
* remove legacyContext support ([dfe49f1](https://github.com/bem/bem-react-core/commit/dfe49f1))



<a name="2.1.1"></a>
## 2.1.1 (2018-07-17)



<a name="2.1.0"></a>
# 2.1.0 (2018-07-16)


### Bug Fixes

* mod predicate take any props ([56632fa](https://github.com/bem/bem-react-core/commit/56632fa))
* remove instanceof guard ([600544a](https://github.com/bem/bem-react-core/commit/600544a))
* remove unstable console.assert from depenedencies ([7efee47](https://github.com/bem/bem-react-core/commit/7efee47))


### Features

* add more arguments for withMods signature ([4b3cfd4](https://github.com/bem/bem-react-core/commit/4b3cfd4))
* get block name from context in Elem ([5009326](https://github.com/bem/bem-react-core/commit/5009326))
* make className for different elems in elem context ([be75c2c](https://github.com/bem/bem-react-core/commit/be75c2c))
* remove wrap and replace methods ([0c896e6](https://github.com/bem/bem-react-core/commit/0c896e6))
* use new context for block and elem ([e5faceb](https://github.com/bem/bem-react-core/commit/e5faceb))



<a name="2.0.0"></a>
# 2.0.0 (2018-07-04)


### Bug Fixes

* **core:** add check for existing key of predicate ([4df72a2](https://github.com/bem/bem-react-core/commit/4df72a2))
* **core:** remove pass all props to render ([775ef4a](https://github.com/bem/bem-react-core/commit/775ef4a))
* add props declaration for anb class ([02c886c](https://github.com/bem/bem-react-core/commit/02c886c))
* **core:** right validations for interfaces ([d87523a](https://github.com/bem/bem-react-core/commit/d87523a))
* add generic for wrap and replace tests ([ea9109e](https://github.com/bem/bem-react-core/commit/ea9109e))
* add optional generics for with-mods ([0fcd445](https://github.com/bem/bem-react-core/commit/0fcd445))
* add typings field, target es2015 ([406f904](https://github.com/bem/bem-react-core/commit/406f904))
* class-name optional for with-mix ([da4654b](https://github.com/bem/bem-react-core/commit/da4654b))
* only functions predicates ([c81e5e3](https://github.com/bem/bem-react-core/commit/c81e5e3))
* prepare for modifiers as class ([c222521](https://github.com/bem/bem-react-core/commit/c222521))
* props, state and component are optional arguments ([08a5586](https://github.com/bem/bem-react-core/commit/08a5586))
* remove not needed static fields for Block ([fb13154](https://github.com/bem/bem-react-core/commit/fb13154))
* remove static display name ([34c4178](https://github.com/bem/bem-react-core/commit/34c4178))
* use stringifyWrapper as named import instead default import ([47d477b](https://github.com/bem/bem-react-core/commit/47d477b))
* **package:** add entity-name to dependencies ([6b1eba9](https://github.com/bem/bem-react-core/commit/6b1eba9))


### Features

* abstract block and elem properties ([d9fec37](https://github.com/bem/bem-react-core/commit/d9fec37))
* add bem class name helper ([dae6520](https://github.com/bem/bem-react-core/commit/dae6520))
* add checking for instanceof ([4eb8e48](https://github.com/bem/bem-react-core/commit/4eb8e48))
* allow simple naming redeclaration ([c2808b2](https://github.com/bem/bem-react-core/commit/c2808b2))
* implement withMix ([a4668cf](https://github.com/bem/bem-react-core/commit/a4668cf))
* improve withMods usage ([506147a](https://github.com/bem/bem-react-core/commit/506147a))
* **core:** add objects natation for mods ([14a4f59](https://github.com/bem/bem-react-core/commit/14a4f59))
* let's go to class based bem-react-core on TS ([b84f649](https://github.com/bem/bem-react-core/commit/b84f649))
* modifier now is simple class ([218815a](https://github.com/bem/bem-react-core/commit/218815a))
* remove with mix hoc ([6eaf371](https://github.com/bem/bem-react-core/commit/6eaf371))
* **core:** dont support addBemClassName, use native components instead ([588209e](https://github.com/bem/bem-react-core/commit/588209e))
* use block name from constructor name ([377573c](https://github.com/bem/bem-react-core/commit/377573c))
* use new context for bem component ([edc739e](https://github.com/bem/bem-react-core/commit/edc739e))
* **core:** bem, block and elem suppors a generic types ([443d328](https://github.com/bem/bem-react-core/commit/443d328))
* **core:** dont pass props and state as args to modes ([1368301](https://github.com/bem/bem-react-core/commit/1368301))
* **core:** implement displayName generation ([1c4ce2a](https://github.com/bem/bem-react-core/commit/1c4ce2a))
* **core:** implement replace and wrap ([58ede8e](https://github.com/bem/bem-react-core/commit/58ede8e))
* **core:** implement unique id generator ([2d2b126](https://github.com/bem/bem-react-core/commit/2d2b126))
* **index:** use Component instead PureComponent ([09e44ca](https://github.com/bem/bem-react-core/commit/09e44ca))
* **react:** check only in dev or test mode ([f6545ce](https://github.com/bem/bem-react-core/commit/f6545ce))
* **react:** react only support ([3e26d53](https://github.com/bem/bem-react-core/commit/3e26d53))
