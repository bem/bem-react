(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
	(factory((global.BemReactCore = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

var origin = {
    delims: {
        elem: '__',
        mod: { name: '_', val: '_' }
    },
    fs: {
        // delims: { elem: '__', mod: '_' }, // redundand because of defaults
        pattern: '${layer}.blocks/${entity}.${tech}',
        scheme: 'nested'
    },
    wordPattern: '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'
};

var react = {
    delims: {
        elem: '-',
        mod: { name: '_', val: '_' }
    },
    fs: {
        delims: { elem: '' },
        pattern: '${layer?${layer}.}blocks/${entity}.${tech}',
        scheme: 'nested'
    },
    wordPattern: '[a-zA-Z0-9]+'
};

var twoDashes = {
    delims: {
        elem: '__',
        mod: { name: '--', val: '_' }
    },
    fs: {
        // delims: { elem: '__', mod: '--' }, // redundand because of defaults
        pattern: '${layer}.blocks/${entity}.${tech}',
        scheme: 'nested'
    },
    wordPattern: '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'
};

var sdk_naming_presets = {
    origin: origin,
    react: react,
    'two-dashes': twoDashes
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var inherit$2 = createCommonjsModule(function (module, exports) {
/**
 * @module inherit
 * @version 2.2.6
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 * @description This module provides some syntax sugar for "class" declarations, constructors, mixins, "super" calls and static members.
 */

(function (global) {

    var hasIntrospection = function () {
        return '_';
    }.toString().indexOf('_') > -1,
        emptyBase = function emptyBase() {},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function (ptp) {
        var inheritance = function inheritance() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
        objKeys = Object.keys || function (obj) {
        var res = [];
        for (var i in obj) {
            hasOwnProperty.call(obj, i) && res.push(i);
        }
        return res;
    },
        extend = function extend(o1, o2) {
        for (var i in o2) {
            hasOwnProperty.call(o2, i) && (o1[i] = o2[i]);
        }

        return o1;
    },
        toStr = Object.prototype.toString,
        isArray = Array.isArray || function (obj) {
        return toStr.call(obj) === '[object Array]';
    },
        isFunction = function isFunction(obj) {
        return toStr.call(obj) === '[object Function]';
    },
        noOp = function noOp() {},
        needCheckProps = true,
        testPropObj = { toString: '' };

    for (var i in testPropObj) {
        // fucking ie hasn't toString, valueOf in for
        testPropObj.hasOwnProperty(i) && (needCheckProps = false);
    }

    var specProps = needCheckProps ? ['toString', 'valueOf'] : null;

    function getPropList(obj) {
        var res = objKeys(obj);
        if (needCheckProps) {
            var specProp,
                i = 0;
            while (specProp = specProps[i++]) {
                obj.hasOwnProperty(specProp) && res.push(specProp);
            }
        }

        return res;
    }

    function override(base, res, add) {
        var addList = getPropList(add),
            j = 0,
            len = addList.length,
            name,
            prop;
        while (j < len) {
            if ((name = addList[j++]) === '__self') {
                continue;
            }
            prop = add[name];
            if (isFunction(prop) && (!prop.prototype || !prop.prototype.__self) && ( // check to prevent wrapping of "class" functions
            !hasIntrospection || prop.toString().indexOf('.__base') > -1)) {
                res[name] = function (name, prop) {
                    var baseMethod = base[name] ? base[name] : name === '__constructor' ? // case of inheritance from plain function
                    res.__self.__parent : noOp,
                        result = function result() {
                        var baseSaved = this.__base;

                        this.__base = result.__base;
                        var res = prop.apply(this, arguments);
                        this.__base = baseSaved;

                        return res;
                    };
                    result.__base = baseMethod;

                    return result;
                }(name, prop);
            } else {
                res[name] = prop;
            }
        }
    }

    function applyMixins(mixins, res) {
        var i = 1,
            mixin;
        while (mixin = mixins[i++]) {
            res ? isFunction(mixin) ? inherit.self(res, mixin.prototype, mixin) : inherit.self(res, mixin) : res = isFunction(mixin) ? inherit(mixins[0], mixin.prototype, mixin) : inherit(mixins[0], mixin);
        }
        return res || mixins[0];
    }

    /**
    * Creates class
    * @exports
    * @param {Function|Array} [baseClass|baseClassAndMixins] class (or class and mixins) to inherit from
    * @param {Object} prototypeFields
    * @param {Object} [staticFields]
    * @returns {Function} class
    */
    function inherit() {
        var args = arguments,
            withMixins = isArray(args[0]),
            hasBase = withMixins || isFunction(args[0]),
            base = hasBase ? withMixins ? applyMixins(args[0]) : args[0] : emptyBase,
            props = args[hasBase ? 1 : 0] || {},
            staticProps = args[hasBase ? 2 : 1],
            res = props.__constructor || hasBase && base.prototype && base.prototype.__constructor ? function () {
            return this.__constructor.apply(this, arguments);
        } : hasBase ? function () {
            return base.apply(this, arguments);
        } : function () {};

        if (!hasBase) {
            res.prototype = props;
            res.prototype.__self = res.prototype.constructor = res;
            return extend(res, staticProps);
        }

        extend(res, base);

        res.__parent = base;

        var basePtp = base.prototype,
            resPtp = res.prototype = objCreate(basePtp);

        resPtp.__self = resPtp.constructor = res;

        props && override(basePtp, resPtp, props);
        staticProps && override(base, res, staticProps);

        return res;
    }

    inherit.self = function () {
        var args = arguments,
            withMixins = isArray(args[0]),
            base = withMixins ? applyMixins(args[0], args[0][0]) : args[0],
            props = args[1],
            staticProps = args[2],
            basePtp = base.prototype;

        props && override(basePtp, basePtp, props);
        staticProps && override(base, base, staticProps);

        return base;
    };

    var defineAsGlobal = true;
    {
        module.exports = inherit;
        defineAsGlobal = false;
    }

    if (typeof modules === 'object' && typeof modules.define === 'function') {
        modules.define('inherit', function (provide) {
            provide(inherit);
        });
        defineAsGlobal = false;
    }

    if (typeof undefined === 'function') {
        undefined(function (require, exports, module) {
            module.exports = inherit;
        });
        defineAsGlobal = false;
    }

    defineAsGlobal && (global.inherit = inherit);
})(commonjsGlobal);
});

/*!
 * node-inherit
 * Copyright(c) 2011 Dmitry Filatov <dfilatov@yandex-team.ru>
 * MIT Licensed
 */

var inherit = inherit$2;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var uniqCount = 0;
var noop = function noop() {};
var prop = function prop(name) {
    return function (props) {
        return props[name];
    };
};

var Component$1 = function (Bem) {
    return inherit(Bem, {
        __constructor: function __constructor() {
            this.__base.apply(this, arguments);
            this.willInit(this.props);
        },


        addBemClassName: function addBemClassName() {
            return true;
        },
        willInit: noop,
        tag: noop,
        attrs: noop,
        style: noop,
        mods: noop,
        addMix: noop,
        cls: prop('cls'),
        mix: prop('mix'),
        content: prop('children'),
        wrap: function wrap(props, state, component) {
            return component;
        },

        render: function render() {
            var props = this.props,
                state = this.state,
                attrs = this.attrs(props, state) || {},
                style = this.style(props, state) || {},
                component = this.__render({
                addBemClassName: this.addBemClassName(props, state),
                tag: this.tag(props, state),
                attrs: _extends({}, attrs, { style: _extends({}, attrs.style, style) }),
                block: this.block,
                elem: this.elem,
                mods: this.mods(props, state),
                mix: [].concat(this.mix(props, state), this.addMix(props, state)),
                cls: this.cls(props, state),
                children: this.content(props, state)
            }),
                optionalyReplaced = this.replace ? this.replace(props, state) : component,
                optionalyWrapped = this.wrap(props, state, optionalyReplaced);

            return optionalyWrapped;
        },
        generateId: function generateId() {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uniq';

            this.__uniqId = this.__uniqId || {};
            return this.__uniqId[key] ? this.__uniqId[key] : this.__uniqId[key] = '' + key + ++uniqCount;
        }
    });
};

/**
 * Forms a string according to object representation of BEM entity.
 *
 * @param {Object|BemEntityName} entity - object representation of BEM entity.
 * @param {BemNamingConventionDelims} delims - separates entity names from each other.
 * @returns {String}
 */

function stringify(entity, delims) {
    if (!entity || !entity.block) {
        return '';
    }

    var res = [entity.block];

    if (entity.elem !== undefined) {
        res.push(delims.elem, entity.elem);
    }

    var mod = entity.mod;
    if (mod !== undefined) {
        var val = mod.val;
        if (typeof mod === 'string') {
            res.push(delims.mod.name, mod);
        } else if (val || !('val' in mod)) {
            res.push(delims.mod.name, mod.name);

            if (val && val !== true) {
                res.push(delims.mod.val, val);
            }
        }
    }

    return res.join('');
}

/**
 * Creates `stringify` function for specified naming convention.
 *
 * @param {BemNamingConvention} convention - options for naming convention.
 * @returns {Function}
 */
var sdk_naming_entity_stringify = function (convention) {
    console.assert(convention.delims && convention.delims.elem && convention.delims.mod, '@bem/sdk.naming.entity.stringify: convention should be an instance of BemNamingEntityConvention');
    return function (entity) {
        return stringify(entity, convention.delims);
    };
};

var delim = '$';

function tokenize(_ref) {
    var block = _ref.block,
        elem = _ref.elem;

    return '' + block + delim + elem;
}

function parse(id) {
    var entity = id.split(delim);
    return {
        block: entity[0],
        elem: entity[1] === 'undefined' ? undefined : entity[1]
    };
}

var bemModes = {
    block: 1,
    elem: 1,
    addBemClassName: 1,
    tag: 1,
    attrs: 1,
    mods: 1,
    mix: 1,
    cls: 1
};

var Bem$2 = function (_ref) {
    var preset = _ref.preset,
        naming = _ref.naming;

    var Base = preset.Base,
        classAttribute = preset.classAttribute,
        Render = preset.Render,
        PropTypes$$1 = preset.PropTypes,
        getRenderProps = function getRenderProps(instance, props) {
        var _babelHelpers$extends;

        var mergedProps = _extends({}, props.attrs, props, (_babelHelpers$extends = {}, _babelHelpers$extends[classAttribute] = instance.__cnb(props), _babelHelpers$extends));

        return Object.keys(mergedProps).reduce(function (props, p) {
            if (!bemModes[p]) props[p] = mergedProps[p];
            return props;
        }, Object.create(null));
    },
        resolveMods = function resolveMods(entity) {
        return entity.elem ? entity.elemMods || entity.mods : entity.mods;
    },
        runtimeNaming = function runtimeNaming(instance) {
        var entityClassName = sdk_naming_entity_stringify(instance.__self.__dangerouslySetNaming || naming);

        return function (_ref2) {
            var _ref2$addBemClassName = _ref2.addBemClassName,
                addBemClassName = _ref2$addBemClassName === undefined ? true : _ref2$addBemClassName,
                block = _ref2.block,
                mods = _ref2.mods,
                elem = _ref2.elem,
                elemMods = _ref2.elemMods,
                mix = _ref2.mix,
                cls = _ref2.cls;

            if (addBemClassName) {
                var resolvedMods = resolveMods({ block: block, mods: mods, elem: elem, elemMods: elemMods }),
                    entities = (instance.__self.bases || []).map(function (key) {
                    return { block: key };
                }).concat({ block: block, elem: elem });

                if (resolvedMods) {
                    var realModsEntities = resolvedMods.__entities || {};
                    for (var modName in resolvedMods) {
                        if (modName === '__entities') continue;

                        if (realModsEntities[modName]) {
                            for (var entity in realModsEntities[modName]) {
                                if (resolvedMods[modName]) {
                                    entity = parse(entity);
                                    entities.push({
                                        block: entity.block,
                                        elem: entity.elem,
                                        mod: { name: modName, val: resolvedMods[modName] }
                                    });
                                }
                            }
                        } else entities.push({
                            block: block,
                            elem: elem,
                            mod: { name: modName, val: resolvedMods[modName] }
                        });
                    }
                }

                if (mix) {
                    var mixedEntities = {},
                        resolveMixed = function resolveMixed(mixed) {
                        mixed.mods = resolveMods(mixed);

                        var k = tokenize(mixed);

                        if (mixedEntities[k]) mixedEntities[k].mods = _extends(resolveMods(_extends({}, mixed, mixedEntities[k])), mixed.mods);else mixedEntities[k] = mixed;
                    },
                        resolveMixes = function resolveMixes(mixes) {
                        for (var _iterator = [].concat(mixes), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                            var _ref3;

                            if (_isArray) {
                                if (_i >= _iterator.length) break;
                                _ref3 = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) break;
                                _ref3 = _i.value;
                            }

                            var _entity = _ref3;

                            if (_entity) {
                                if (typeof _entity.type === 'function') {
                                    var props = _entity.props,
                                        inst = new _entity.type(props);

                                    _entity = {
                                        block: inst.block,
                                        elem: inst.elem,
                                        mods: inst.mods(props),
                                        mix: [inst.mix(props), inst.addMix(props)]
                                    };
                                }

                                resolveMixed(_entity);
                                _entity.mix && resolveMixes(_entity.mix);
                            }
                        }
                    };

                    resolveMixes(mix);

                    Object.keys(mixedEntities).forEach(function (k) {
                        var mixed = mixedEntities[k],
                            mixedMods = mixed.mods,
                            mixedBlock = mixed.block || block,
                            mixedElem = mixed.elem;

                        entities.push({ block: mixedBlock, elem: mixedElem });

                        mixedMods && Object.keys(mixedMods).forEach(function (name) {
                            var val = mixedMods[name];
                            val && entities.push({ block: mixedBlock, elem: mixedElem, mod: { name: name, val: val } });
                        });
                    });
                }

                cls && entities.push(cls);

                return entities.map(function (entity) {
                    return typeof entity === 'string' ? entity : entityClassName(entity);
                }).join(' ');
            }
        };
    };

    return inherit(Base, {
        __constructor: function __constructor() {
            this.__base.apply(this, arguments);
            this.__cnb || (this.__cnb = runtimeNaming(this));
        },
        getChildContext: function getChildContext() {
            var block = this.block || this.props.block,
                elem = this.elem || this.props.elem,
                contextBlock = this.context && this.context.bemBlock;

            return block && !elem && contextBlock !== block || typeof contextBlock === 'undefined' ? { bemBlock: block } : {};
        },
        render: function render() {
            var props = _extends({}, this.props);
            var bemBlock = this.context.bemBlock;


            if (!props.elem && !props.block && bemBlock) throw Error('Prop elem must be specified');

            var typeOfBlock = typeof props.block;
            if (typeOfBlock === 'undefined') props.block = bemBlock;
            /* istanbul ignore next */
            else if (typeOfBlock === 'object') props.block = block.block;
                /* istanbul ignore next */
                else if (typeOfBlock === 'function') props.block = block.prototype.block;

            if (!props.block) throw Error('Can\'t get block from context');

            return this.__render(props);
        },
        __render: function __render(props) {
            return Render(props.tag || 'div', getRenderProps(this, props));
        }
    }, {
        displayName: 'Bem',

        childContextTypes: {
            bemBlock: PropTypes$$1.string
        },

        contextTypes: {
            bemBlock: PropTypes$$1.string
        },

        __displayName: function __displayName(_ref4) {
            var block = _ref4.block,
                elem = _ref4.elem;

            this.__cnb || (this.__cnb = sdk_naming_entity_stringify(this.__dangerouslySetNaming || naming));
            return this.__cnb({ block: block, elem: elem });
        }
    });
};

function Core(options) {
    var UserBem = Bem$2(options),
        Base = Component$1(UserBem),
        validateDecl = function validateDecl(decl) {
        if (!decl.block) throw new Error('Declaration must specify block field');
    },
        bemName = Base.__displayName.bind(Base),
        entities = {},
        castModVal = function castModVal(modVal) {
        return typeof modVal === 'number' ? modVal.toString() : modVal;
    },
        lifecycleHooks = {
        didCatch: 'componentDidCatch',
        willMount: 'componentWillMount',
        didMount: 'componentDidMount',
        willReceiveProps: 'componentWillReceiveProps',
        shouldUpdate: 'shouldComponentUpdate',
        willUpdate: 'componentWillUpdate',
        didUpdate: 'componentDidUpdate',
        willUnmount: 'componentWillUnmount'
    },
        wrapWithFunction = function wrapWithFunction(obj, name) {
        if (Array.isArray(name)) name.forEach(function (n) {
            return wrapWithFunction(obj, n);
        });else if (obj.hasOwnProperty(name)) {
            var val = obj[name];
            typeof val !== 'function' && (obj[name] = function () {
                return val;
            });
        }

        return obj;
    },
        makePredicates = function makePredicates(obj) {
        return wrapWithFunction(obj, ['addBemClassName', 'tag', 'attrs', 'style', 'content', 'cls', 'mods', 'mix', 'addMix', 'wrap']);
    },
        collectMods = function collectMods(fields) {
        if (fields.hasOwnProperty('mods')) {
            var val = fields['mods'];
            fields['mods'] = function () {
                // FIXME: @dfilatov
                var collected = [val, this.__base][0].apply(this, arguments) || {},
                    entities = collected.__entities || (collected.__entities = {});

                for (var modName in collected) {
                    if (modName === '__entities') continue;

                    (entities[modName] || (entities[modName] = {}))[tokenize(fields)] = true;
                }

                return collected;
            };
        }

        return fields;
    },
        buildModPredicateFunction = function buildModPredicateFunction(predicate) {
        if (typeof predicate === 'function') return predicate;

        var modNames = Object.keys(predicate);

        if (modNames.length === 1) {
            // simplest, but most common case
            var modName = modNames[0];

            var modVal = predicate[modName];

            return typeof modVal === 'function' ? modVal : (modVal = castModVal(modVal)) === '*' ? function (props) {
                return !!castModVal(props[modName]);
            } : function (props) {
                return props[modName] === modVal;
            };
        }

        return function (props) {
            var _this = this;

            return modNames.every(function (modName) {
                var modPredicate = predicate[modName];
                return typeof modPredicate === 'function' ? modPredicate.call(_this, props) : modPredicate === '*' ? !!castModVal(props[modName]) : castModVal(modPredicate) === castModVal(props[modName]);
            });
        };
    },
        buildAutoModsFunction = function buildAutoModsFunction(predicate) {
        if (typeof predicate === 'function') return undefined;

        var modNames = Object.keys(predicate);

        if (modNames.length === 1) {
            // simplest, but most common case
            var modName = modNames[0];

            return function (props) {
                var _babelHelpers$extends;

                return _extends({}, this.__base.apply(this, arguments), (_babelHelpers$extends = {}, _babelHelpers$extends[modName] = props[modName], _babelHelpers$extends));
            };
        }

        return function (props) {
            return _extends({}, this.__base.apply(this, arguments), modNames.reduce(function (res, modName) {
                res[modName] = props[modName];
                return res;
            }, {}));
        };
    },
        wrapFieldForMod = function wrapFieldForMod(field, predicateFn, baseMethod) {
        return function () {
            var method = void 0;
            if (predicateFn.call(this, this.props, this.state)) method = field;else baseMethod && baseMethod !== field && (method = this.__base);

            return method && method.apply(this, arguments);
        };
    },
        extendFields = function extendFields(from, to) {
        if (from) for (var field in to) {
            from[field] && _extends(to[field], from[field]);
        }
    },
        fixHooks = function fixHooks(obj) {
        for (var oldName in lifecycleHooks) {
            if (obj[oldName]) {
                obj[lifecycleHooks[oldName]] = obj[oldName];
                delete obj[oldName];
            }
        }return obj;
    },
        buildExtendableFields = function buildExtendableFields() {
        var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return ['propTypes', 'defaultProps', 'contextTypes', 'childContextTypes'].reduce(function (obj, field) {
            obj[field] = _extends({}, origin[field]);
            return obj;
        }, {});
    },
        applyEntityDecls = function applyEntityDecls() {
        var entity = this;
        var entityCls = entity.cls;

        function applyEntityDecl(cls, decl) {
            var staticFields = decl.staticFields;
            var fields = decl.fields,
                extendableFields = buildExtendableFields(cls);


            [].concat(cls, staticFields).forEach(function (c) {
                return extendFields(c, extendableFields);
            });
            staticFields = _extends({}, staticFields, extendableFields, { displayName: bemName(fields) });

            return cls !== Base ? inherit.self(cls, fields, staticFields) : inherit(Base, fields, _extends({}, staticFields, { bases: entity.bases }));
        }

        function applyEntityModDecls(cls, decls) {
            var ptp = cls.prototype,
                extendableFields = buildExtendableFields(cls);

            var i = entity.appliedModDeclsCount,
                decl = void 0;
            while (decl = decls[i++]) {
                var _decl = decl,
                    predicate = _decl.predicate,
                    fields = _decl.fields,
                    staticFields = _decl.staticFields,
                    predicateFn = buildModPredicateFunction(predicate),
                    autoModsFn = buildAutoModsFunction(predicate);


                autoModsFn && inherit.self(cls, { mods: wrapFieldForMod(autoModsFn, predicateFn, ptp.mods) });

                for (var name in fields) {
                    var field = fields[name];
                    typeof field === 'function' && (fields[name] = wrapFieldForMod(field, predicateFn, ptp[name]));
                }

                extendFields(staticFields, extendableFields);

                inherit.self(cls, fields, staticFields);
            }

            return _extends(cls, extendableFields);
        }

        !entityCls && entity.decls && (entityCls = entity.cls = entity.decls.reduce(function (cls, decl) {
            return Array.isArray(decl) ? applyEntityModDecls(cls, decl) : applyEntityDecl(cls, decl);
        }, Base));

        if (entityCls && entity.modDecls) {
            applyEntityModDecls(entityCls, entity.modDecls);
            entity.appliedModDeclsCount = entity.modDecls.length;
        }

        if (entityCls && entity.declWrappers) {
            entity.wrappedCls = entity.declWrappers.reduce(function (prevCls, wrapper) {
                return wrapper(prevCls);
            }, entityCls);
            entity.declWrappers = null;
        }

        var resCls = entity.wrappedCls || entityCls;

        if (resCls) resCls.default = resCls;

        return resCls;
    },
        getEntity = function getEntity(key) {
        return entities[key] || (entities[key] = {
            cls: null,
            base: null,
            decls: null,
            modDecls: null,
            appliedModDeclsCount: 0,
            applyDecls: applyEntityDecls
        });
    };

    return {
        Bem: UserBem,

        decl: function decl(base, fields, staticFields, wrapper) {
            if (typeof base !== 'function' && !Array.isArray(base)) {
                wrapper = staticFields;
                staticFields = fields;
                fields = base;
                base = undefined;
            }

            if (typeof staticFields === 'function') {
                wrapper = staticFields;
                staticFields = undefined;
            }

            validateDecl(fields);
            fixHooks(fields);
            makePredicates(fields);

            var key = bemName(fields),
                entity = getEntity(key),
                entityBases = entity.bases || (entity.bases = []),
                entityDecls = entity.decls || (entity.decls = []),
                declaredBases = entity.declaredBases || (entity.declaredBases = {});

            collectMods(fields);

            base && (Array.isArray(base) ? base : [base]).forEach(function (_ref) {
                var displayName = _ref.displayName;

                if (!declaredBases[displayName]) {
                    var baseEntity = getEntity(displayName);
                    entityBases.push(displayName);
                    entityDecls.push.apply(entityDecls, baseEntity.decls);
                    entityDecls.push(baseEntity.modDecls || (baseEntity.modDecls = []));
                    declaredBases[displayName] = true;
                }
            });

            entityDecls.push({ fields: fields, staticFields: staticFields });

            wrapper && (entity.declWrappers || (entity.declWrappers = [])).push(wrapper);

            return entity;
        },
        declMod: function declMod(predicate, fields, staticFields) {
            validateDecl(fields);

            fixHooks(fields);
            makePredicates(fields);

            var entity = getEntity(bemName(fields));

            (entity.modDecls || (entity.modDecls = [])).push({ predicate: predicate, fields: fields, staticFields: staticFields });

            return entity;
        }
    };
}

var _Core = Core({
    preset: {
        Render: React__default.createElement.bind(React__default),
        Base: React.Component,
        classAttribute: 'className',
        PropTypes: PropTypes
    },
    naming: sdk_naming_presets[process.env.BEM_NAMING || 'react']
});
var Bem = _Core.Bem;
var decl = _Core.decl;
var declMod = _Core.declMod;

exports['default'] = Bem;
exports.decl = decl;
exports.declMod = declMod;

Object.defineProperty(exports, '__esModule', { value: true });

})));
