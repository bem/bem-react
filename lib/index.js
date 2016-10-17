import React from 'react';
import inherit from 'inherit';

export default function bemReactCore(options = {}, Bem, Base, classBuilder) {
    const entities = {};
    Base.prototype.classBuilder = classBuilder;
    Base.prototype.Bem = Bem;

    function applyEntityDecls() {
        const entity = this;

        if(entity.decls) {
            entity.decls.forEach(({ fields, staticFields}) => {
                entity.cls?
                    inherit.self(entity.cls, fields, staticFields) :
                    entity.cls = inherit(
                        entity.base ? entity.base : Base,
                        fields,
                        {
                            displayName : classBuilder.stringify(
                                fields.block, fields.elem
                            ),
                            ...staticFields
                        }
                    );
            });

            entity.decls = null;
        }

        if(entity.modDecls) {
            const ptp = entity.cls.prototype;

            entity.modDecls.forEach(({ predicate, fields, staticFields }) => {
                for(let name in fields) {
                    const field = fields[name];
                    typeof field === 'function' && (fields[name] = function() {
                        let method;
                        if(predicate.call(this, this.props)) {
                            method = field;
                        } else {
                            const baseMethod = ptp[name];
                            baseMethod && baseMethod !== field &&
                                (method = this.__base);
                        }

                        return method && method.apply(this, arguments);
                    });
                }

                inherit.self(entity.cls, fields, staticFields);
            });

            entity.modDecls = null;
        }

        return entity.cls;
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

            const key = classBuilder.stringify(fields.block, fields.elem),
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

            const entity = getEntity(classBuilder.stringify(fields.block, fields.elem));

            entity.modDecls = entity.modDecls || [];
            entity.modDecls.push({ predicate, fields, staticFields });

            return entity;
        }
    }

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
    return wrapWithFunction(obj, [
        'tag', 'attrs', 'content', 'mods', 'mix', 'cls'
    ]);
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
    for(let oldName in lifecycleHooks) {
        if(obj[oldName]) {
            obj[lifecycleHooks[oldName]] = obj[oldName];
            delete obj[oldName];
        }
    }

    return obj;
}
