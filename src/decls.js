import inherit from 'inherit';

export default function bemReactCore(BaseComponent, overrideFields={}, overrideStaticFields={}) {
    const Base = inherit.self(BaseComponent, overrideFields, overrideStaticFields),
        entities = {};

    function applyEntityDecls() {
        const entity = this;
        let entityCls = entity.cls;

        if(entity.decls) {
            entity.decls.forEach(({ fields, staticFields }) => {
                const base = entityCls?
                        entityCls :
                        entity.base? entity.base : Base,
                    extendableFields = {
                        propTypes : {},
                        defaultProps : {},
                        contextTypes : {},
                        childContextTypes : {}
                    };

                [].concat(base, staticFields).forEach(cls => extendFields(cls, extendableFields));

                staticFields = { ...staticFields, ...extendableFields };

                entityCls?
                    inherit.self(base, fields, staticFields) :
                    entityCls = entity.cls = inherit(
                        base,
                        fields,
                        {
                            displayName : Base.displayName(fields.block, fields.elem),
                            ...staticFields
                        }
                    );
            });

            entity.decls = null;
        }

        if(entityCls && entity.modDecls) {
            const ptp = entityCls.prototype,
                extendableFields = {
                    propTypes : { ...entityCls.propTypes },
                    defaultProps : { ...entityCls.defaultProps },
                    contextTypes : { ...entityCls.contextTypes },
                    childContextTypes : { ...entityCls.childContextTypes }
                };

            entity.modDecls.forEach(({ predicate, fields, staticFields }) => {
                const predicateFn = buildModPredicateFunction(predicate),
                    autoModsFn = buildAutoModsFunction(predicate);

                autoModsFn &&
                    inherit.self(entityCls, { mods : wrapFieldForMod(autoModsFn, predicateFn, ptp.mods) });

                for(let name in fields) {
                    const field = fields[name];
                    typeof field === 'function' &&
                        (fields[name] = wrapFieldForMod(field, predicateFn, ptp[name]));
                }

                extendFields(staticFields, extendableFields);

                inherit.self(entityCls, fields, staticFields);
            });

            Object.assign(entityCls, extendableFields);

            entity.modDecls = null;
        }

        if(entityCls && entity.declWrappers) {
            entity.wrappedCls = entity.declWrappers.reduce(
                (prevCls, wrapper) => wrapper(prevCls),
                entityCls);
            entity.declWrappers = null;
        }

        return entity.wrappedCls || entityCls;
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

            if(!fields.block) throw Error('Declaration must specify block field');

            fixHooks(wrapBemFields(fields));

            const key = Base.displayName(fields.block, fields.elem),
                entity = getEntity(key);

            if(base) {
                if(entity.base) throw new Error(
                    `BEM entity "${key}" has multiple ancestors`
                );
                entity.base = base;
            }

            entity.decls = entity.decls || [];
            entity.decls.push({ fields, staticFields });

            wrapper && (entity.declWrappers || (entity.declWrappers = [])).push(wrapper);

            return entity;
        },

        declMod(predicate, fields, staticFields) {
            if(!fields.block) throw Error('Declaration must specify block field');

            fixHooks(wrapBemFields(fields));

            const entity = getEntity(Base.displayName(fields.block, fields.elem));

            entity.modDecls = entity.modDecls || [];
            entity.modDecls.push({ predicate, fields, staticFields });

            return entity;
        }
    };

}

function wrapWithFunction(obj, name) {
    if(Array.isArray(name))
        name.forEach(n => wrapWithFunction(obj, n));
    else
        if(obj.hasOwnProperty(name)) {
            const val = obj[name];
            typeof val !== 'function' && (obj[name] = () => val);
        }


    return obj;
}

function wrapBemFields(obj) {
    return wrapWithFunction(obj, ['tag', 'attrs', 'style', 'content', 'mods', 'mix', 'cls']);
}

function buildModPredicateFunction(predicate) {
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
}

function buildAutoModsFunction(predicate) {
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
}

function wrapFieldForMod(field, predicateFn, baseMethod) {
    return function() {
        let method;
        if(predicateFn.call(this, this.props))
            method = field;
        else
            baseMethod && baseMethod !== field &&
                (method = this.__base);


        return method && method.apply(this, arguments);
    };
}

function extendFields(from, to) {
    if(from)
        for(let field in to)
            from[field] && Object.assign(to[field], from[field]);
}

function castModVal(modVal) {
    return typeof modVal === 'number'?
        modVal.toString() :
        modVal;
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
