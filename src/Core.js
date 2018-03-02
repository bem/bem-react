import inherit from 'inherit';
import Component from './Component';
import Bem from './Bem';
import { tokenize } from './Entity';

export default function Core(options) {
    const UserBem = Bem(options),
        Base = Component(UserBem),
        validateDecl = decl => {
            if(!decl.block)
                throw new Error('Declaration must specify block field');
        },
        bemName = Base.__displayName.bind(Base),
        entities = {},
        castModVal = modVal => typeof modVal === 'number'? modVal.toString() : modVal,
        lifecycleHooks = {
            didCatch : 'componentDidCatch',
            willMount : 'componentWillMount',
            didMount : 'componentDidMount',
            willReceiveProps : 'componentWillReceiveProps',
            shouldUpdate : 'shouldComponentUpdate',
            willUpdate : 'componentWillUpdate',
            didUpdate : 'componentDidUpdate',
            willUnmount : 'componentWillUnmount'
        },
        wrapWithFunction = (obj, name) => {
            if(Array.isArray(name))
                name.forEach(n => wrapWithFunction(obj, n));
            else if(obj.hasOwnProperty(name)) {
                const val = obj[name];
                typeof val !== 'function' && (obj[name] = () => val);
            }

            return obj;
        },
        makePredicates = obj =>
            wrapWithFunction(obj,
                ['addBemClassName', 'tag', 'attrs', 'style', 'content', 'cls', 'mods', 'mix', 'addMix', 'wrap']),
        collectMods = (fields) => {
            if(fields.hasOwnProperty('mods')) {
                const val = fields['mods'];
                fields['mods'] = function() {
                    // FIXME: @dfilatov
                    const collected = [val, this.__base][0].apply(this, arguments) || {},
                        entities = collected.__entities || (collected.__entities = {});

                    for(let modName in collected) {
                        if(modName === '__entities') continue;

                        (entities[modName] || (entities[modName] = {}))[tokenize(fields)] = true;
                    }

                    return collected;
                };
            }

            return fields;
        },
        buildModPredicateFunction = predicate => {
            if(typeof predicate === 'function') return predicate;

            const modNames = Object.keys(predicate);

            if(modNames.length === 1) { // simplest, but most common case
                const [modName] = modNames;
                let modVal = predicate[modName];

                return typeof modVal === 'function'?
                    modVal :
                    (modVal = castModVal(modVal)) === '*'?
                        props => !!castModVal(props[modName]) :
                        props => props[modName] === modVal;
            }

            return function(props) {
                return modNames.every(modName => {
                    const modPredicate = predicate[modName];
                    return typeof modPredicate === 'function'?
                        modPredicate.call(this, props) :
                        modPredicate === '*'?
                            !!castModVal(props[modName]) :
                            castModVal(modPredicate) === castModVal(props[modName]);
                });
            };
        },
        buildAutoModsFunction = predicate => {
            if(typeof predicate === 'function') return undefined;

            const modNames = Object.keys(predicate);

            if(modNames.length === 1) { // simplest, but most common case
                const [modName] = modNames;
                return function(props) {
                    return {
                        ...this.__base(...arguments),
                        [modName] : props[modName]
                    };
                };
            }

            return function(props) {
                return {
                    ...this.__base(...arguments),
                    ...modNames.reduce((res, modName) => {
                        res[modName] = props[modName];
                        return res;
                    }, {})
                };
            };
        },
        wrapFieldForMod = (field, predicateFn, baseMethod) =>
            function() {
                let method;
                if(predicateFn.call(this, this.props, this.state))
                    method = field;
                else
                    baseMethod && baseMethod !== field &&
                        (method = this.__base);

                return method && method.apply(this, arguments);
            },
        extendFields = (from, to) => {
            if(from)
                for(let field in to)
                    from[field] && Object.assign(to[field], from[field]);
        },
        fixHooks = obj => {
            for(let oldName in lifecycleHooks)
                if(obj[oldName]) {
                    obj[lifecycleHooks[oldName]] = obj[oldName];
                    delete obj[oldName];
                }

            return obj;
        },
        buildExtendableFields = (origin = {}) =>
            ['propTypes', 'defaultProps', 'contextTypes', 'childContextTypes'].reduce((obj, field) => {
                obj[field] = { ...origin[field] };
                return obj;
            }, {}),
        applyEntityDecls = function() {
            const entity = this;
            let entityCls = entity.cls;

            function applyEntityDecl(cls, decl) {
                let { staticFields } = decl;
                const { fields } = decl,
                    extendableFields = buildExtendableFields(cls);

                [].concat(cls, staticFields).forEach(c => extendFields(c, extendableFields));
                staticFields = {
                    ...staticFields,
                    ...extendableFields,
                    displayName : (staticFields && staticFields.displayName) || bemName(fields)
                };

                return cls !== Base?
                    inherit.self(cls, fields, staticFields) :
                    inherit(Base, fields, { ...staticFields, bases : entity.bases });
            }

            function applyEntityModDecls(cls, decls) {
                const ptp = cls.prototype,
                    extendableFields = buildExtendableFields(cls);

                let i = entity.appliedModDeclsCount,
                    decl;
                while(decl = decls[i++]) {
                    const { predicate, fields, staticFields } = decl,
                        predicateFn = buildModPredicateFunction(predicate),
                        autoModsFn = buildAutoModsFunction(predicate);

                    autoModsFn &&
                        inherit.self(cls, { mods : wrapFieldForMod(autoModsFn, predicateFn, ptp.mods) });

                    for(let name in fields) {
                        const field = fields[name];
                        typeof field === 'function' &&
                            (fields[name] = wrapFieldForMod(field, predicateFn, ptp[name]));
                    }

                    extendFields(staticFields, extendableFields);

                    inherit.self(cls, fields, staticFields);
                }

                return Object.assign(cls, extendableFields);
            }

            !entityCls && entity.decls && (entityCls = entity.cls = entity.decls.reduce((cls, decl) => {
                return Array.isArray(decl)?
                    applyEntityModDecls(cls, decl) :
                    applyEntityDecl(cls, decl);
            }, Base));

            if(entityCls && entity.modDecls) {
                applyEntityModDecls(entityCls, entity.modDecls);
                entity.appliedModDeclsCount = entity.modDecls.length;
            }

            if(entityCls && entity.declWrappers) {
                entity.wrappedCls = entity.declWrappers.reduce(
                    (prevCls, wrapper) => wrapper(prevCls),
                    entityCls);
                entity.declWrappers = null;
            }

            const resCls = entity.wrappedCls || entityCls;

            if(resCls) resCls.default = resCls;

            return resCls;
        },
        getEntity = key => entities[key] || (entities[key] = {
            cls : null,
            base : null,
            decls : null,
            modDecls : null,
            appliedModDeclsCount : 0,
            applyDecls : applyEntityDecls
        });

    return {
        Bem : UserBem,

        decl(base, fields, staticFields, wrapper) {
            if(typeof base !== 'function' && !Array.isArray(base)) {
                wrapper = staticFields;
                staticFields = fields;
                fields = base;
                base = undefined;
            }

            if(typeof staticFields === 'function') {
                wrapper = staticFields;
                staticFields = undefined;
            }

            validateDecl(fields);
            fixHooks(fields);
            makePredicates(fields);


            const key = bemName(fields),
                entity = getEntity(key),
                entityBases = entity.bases || (entity.bases = []),
                entityDecls = entity.decls || (entity.decls = []),
                declaredBases = entity.declaredBases || (entity.declaredBases = {});

            collectMods(fields);

            base && (Array.isArray(base) ? base : [base]).forEach(({ displayName }) => {
                if(!declaredBases[displayName]) {
                    const baseEntity = getEntity(displayName);
                    entityBases.push(displayName);
                    entityDecls.push(...baseEntity.decls);
                    entityDecls.push(baseEntity.modDecls || (baseEntity.modDecls = []));
                    declaredBases[displayName] = true;
                }
            });

            entityDecls.push({ fields, staticFields });

            wrapper && (entity.declWrappers || (entity.declWrappers = [])).push(wrapper);

            return entity;
        },

        declMod(predicate, fields, staticFields) {
            validateDecl(fields);

            fixHooks(fields);
            makePredicates(fields);

            const entity = getEntity(bemName(fields));

            (entity.modDecls || (entity.modDecls = [])).push({ predicate, fields, staticFields });

            return entity;
        }
    };
}
