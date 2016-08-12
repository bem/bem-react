'use strict';

const path = require('path'),
    bemNaming = require('bem-naming')({ elem : '-' }),
    falafel = require('falafel'),
    vow = require('vow'),
    vowFs = require('vow-fs'),
    isFileJsModule = file => path.extname(file) === '.js';

module.exports = function(source) {
    this.cacheable && this.cacheable();

    const callback = this.async(),
        options = this.options.bemLoader,
        levels = options.levels,
        techs = options.techs,
        allPromises = [],
        result = falafel(source, node => {
            if(
                node.type === 'CallExpression' &&
                node.callee.type === 'Identifier' &&
                node.callee.name === 'require' &&
                node.arguments[0].value.match(/^(b|e|m)\:/)
            ) {
                let requireIdx = null;

                const currentEntityRequires = parseEntityImport(
                    node.arguments[0].value,
                    bemNaming.parse(path.basename(this.resourcePath).split('.')[0]))
                        .map(entity => {
                            const entityFiles = getEntityFiles(entity, levels, techs);

                            entityFiles.forEach(this.addDependency, this);

                            return vow.all(entityFiles.map(vowFs.exists))
                                .then(fileExistsRes => {
                                    const requires = entityFiles
                                        .filter((_, i) => fileExistsRes[i])
                                        .map((entityFile, i) => {
                                            !entity.modName && isFileJsModule(entityFile) && (requireIdx = i);
                                            return `require('${entityFile}')`
                                        });

                                    return { entity, requires };
                                });
                        });

                allPromises.push(vow.all(currentEntityRequires)
                    .then(currentEntityRequires => {
                        const requires = currentEntityRequires.reduce((res, entity) => {
                            if(!entity.requires.length) {
                                throw new Error(`No BEM entity: "${bemNaming.stringify(entity.entity)}"`);
                            }

                            return res.concat(entity.requires);
                        }, []);

                        node.update(
                            `[${requires.join(',')}]` +
                            (requireIdx !== null? `[${requireIdx}].default.applyDecls()` : '')
                        );
                    }));
            }
        });

    vow.all(allPromises)
        .then(() => {
            callback(null, result.toString());
        })
        .catch(callback);
};

function parseEntityImport(entityImport, ctx) {
    const res = [],
        main = {};

    entityImport.split(' ').forEach((importToken, i) => {
        const split = importToken.split(':'),
            type = split[0],
            tail = split[1];

        if(!i) {
            main.block = type === 'b'? tail : ctx.block;
            main.elem = type === 'e'? tail : ctx.elem;
        }

        switch(type) {
            case 'b':
            case 'e':
                res.push(main);
            break;

            case 'm':
                const splitMod = tail.split('='),
                    modName = splitMod[0],
                    modVals = splitMod[1];

                if(modVals) {
                    modVals.split('|').forEach(modVal => {
                        res.push(Object.assign({}, main, { modName, modVal }));
                    });
                } else {
                    res.push(Object.assign({}, main, { modName }));
                }
            break;
        }
    });

    return res;
}

function getEntityFiles(entity, levels, techs) {
    const prefixes = levels.map(level => path.resolve(
        process.cwd(), // TODO: use proper relative resolving
        path.join(
            level,
            entity.block,
            entity.elem || '', // TODO: use level naming scheme https://github.com/bem/bem-react-core/issues/3
            entity.modName? `_${entity.modName}` : '',
            bemNaming.stringify(entity))));

    return techs.reduce((res, tech) =>
        res.concat(prefixes.map(prefix => prefix + '.' + tech)),
        []);
}
