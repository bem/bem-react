import inherit from 'inherit';
import renderTag from './renderTag';

export default function bemReactCore(options, BaseComponent, classNameBuilder) {
    const entities = {};
    BaseComponent.prototype.__render = renderTag(classNameBuilder);

    function applyEntityDecls() {
        const entity = this;
        let entityCls = entity.cls;

        if(entity.decls) {
            entity.decls.forEach(({ fields, staticFields }) => {
                const base = entityCls?
                        entityCls :
                        entity.base? entity.base : BaseComponent,
                    propTypes = {},
                    defaultProps = {};

                [].concat(base, staticFields).forEach(cls => {
                    if(cls) {
                        cls.propTypes && Object.assign(propTypes, cls.propTypes);
                        cls.defaultProps && Object.assign(defaultProps, cls.defaultProps);
                    }
                });

                staticFields = { ...staticFields, propTypes, defaultProps };

                entityCls?
                    inherit.self(base, fields, staticFields) :
                    entityCls = entity.cls = inherit(
                        base,
                        fields,
                        {
                            displayName : classNameBuilder.stringify(
                                fields.block, fields.elem
                            ),
                            ...staticFields
                        }
                    );
            });

            entity.decls = null;
        }

        if(entity.modDecls) {
            const ptp = entityCls.prototype,
                propTypes = { ...entityCls.propTypes },
                defaultProps = { ...entityCls.defaultProps };

            entity.modDecls.forEach(({ predicate, fields, staticFields }) => {
                const predicateFn = buildModPredicateFunction(predicate),
                    modsFn = buildModsFunction(predicate, fields, ptp);

                modsFn && (fields = {
                    ...fields,
                    mods : modsFn
                });

                for(let name in fields) {
                    const field = fields[name];
                    typeof field === 'function' && (fields[name] = function() {
                        let method;
                        if(predicateFn.call(this, this.props)) {
                            method = field;
                        } else {
                            const baseMethod = ptp[name];
                            baseMethod && baseMethod !== field &&
                                (method = this.__base);
                        }

                        return method && method.apply(this, arguments);
                    });
                }

                if(staticFields) {
                    staticFields.propTypes && Object.assign(propTypes, staticFields.propTypes);
                    staticFields.defaultProps && Object.assign(defaultProps, staticFields.defaultProps);
                }

                inherit.self(entityCls, fields, staticFields);
            });

            Object.assign(entityCls, { propTypes, defaultProps });

            entity.modDecls = null;
        }

        return entityCls;
    }

    function getEntity(key) {
        return entities[key] || (entities[key] = {
            cls : null,
            base : null,
            decls : null,
            modDecls : null,
            applyDecls : applyEntityDecls
        });
    }

    return {
        decl(base, fields, staticFields) {
            if(typeof base !== 'function') {
                staticFields = fields;
                fields = base;
                base = undefined;
            }

            fixHooks(wrapBemFields(fields));

            const key = classNameBuilder.stringify(fields.block, fields.elem),
                entity = getEntity(key);

            if(base) {
                if(entity.base) throw new Error(
                    `BEM-entity "${key}" has multiple ancestors`
                );
                entity.base = base;
            }

            entity.decls = entity.decls || [];
            entity.decls.push({ fields, staticFields });

            return entity;
        },

        declMod(predicate, fields, staticFields) {
            fixHooks(wrapBemFields(fields));

            const entity = getEntity(classNameBuilder.stringify(fields.block, fields.elem));

            entity.modDecls = entity.modDecls || [];
            entity.modDecls.push({ predicate, fields, staticFields });

            return entity;
        }
    };

}

function wrapWithFunction(obj, name) {
    if(Array.isArray(name)) {
        name.forEach(n => wrapWithFunction(obj, n));
    } else {
        if(obj.hasOwnProperty(name)) {
            const val = obj[name];
            typeof val !== 'function' && (obj[name] = () => val);
        }
    }

    return obj;
}

function wrapBemFields(obj) {
    return wrapWithFunction(obj, ['tag', 'attrs', 'content', 'mods', 'mix', 'cls']);
}

function buildModPredicateFunction(predicate) {
    if(typeof predicate === 'function')
        return predicate;

    const modNames = Object.keys(predicate);

    if(modNames.length === 1) { // simplest, but most common case
        const [modName] = modNames,
            modVal = predicate[modName];

        return typeof modVal === 'function'?
            modVal :
            modVal === '*'?
                props => !!props[modName] :
                props => props[modName] === modVal;
    }

    return function(props) {
        return modNames.every(modName => {
            const modPredicate = predicate[modName];
            return typeof modPredicate === 'function'?
                modPredicate.call(this, props) :
                modPredicate === '*'?
                    !!props[modName] :
                    modPredicate === props[modName];
        });
    };
}

function buildModsFunction(predicate, fields, ptp) {
    if(typeof predicate === 'function')
        return undefined;

    const origMods = fields.mods,
        modNames = Object.keys(predicate);
    let autoMods;

    if(modNames.length === 1) { // simplest, but most common case
        const [modName] = modNames;
        autoMods = function(props) {
            return {
                ...this.__base.apply(this, arguments),
                [modName] : props[modName]
            };
        };
    } else {
        autoMods = function(props) {
            return {
                ...this.__base.apply(this, arguments),
                ...modNames.reduce((res, modName) => {
                    res[modName] = props[modName];
                    return res;
                }, {})
            };
        };
    }

    if(origMods) {
        const origBase = ptp.mods,
            autoModsWithBase = function() {
                this.__base = origBase;
                return autoMods.apply(this, arguments);
            };

        return function(props) {
            this.__base = autoModsWithBase;
            const res = origMods.apply(this, arguments);
            this.__base = origBase;
            return res;
        };
    }

    return autoMods;
}

const lifecycleHooks = {
    willMount : 'componentWillMount',
    didMount : 'componentDidMount',
    willReceiveProps : 'componentWillReceiveProps',
    shouldUpdate : 'shouldComponentUpdate',
    willUpdate : 'componentWillUpdate',
    didUpdate : 'componentDidUpdate',
    willUnmount : 'componentWillUnmount'
};

function fixHooks(obj) {
    for(let oldName in lifecycleHooks)
        if(obj[oldName]) {
            obj[lifecycleHooks[oldName]] = obj[oldName];
            delete obj[oldName];
        }

    return obj;
}
