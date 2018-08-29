'use strict';

const { resolve } = require('path');
const { rollup } = require('rollup');
const { uglify } = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const chalk = require('chalk');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolver = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');

const { asyncRimRaf } = require('./utils');
const { BUNDLE_TYPES, bundleConfig } = require('./config')

const context = resolve(__dirname, '..', '..');
const buildDir = resolve(context, 'packages', process.env.PKG, 'build');

function getFilename(name, type) {
    switch (type) {
        case BUNDLE_TYPES.NODE_DEV:
            return `${name}.development.js`;
        case BUNDLE_TYPES.NODE_PROD:
            return `${name}.production.min.js`;
        default:
            throw new Error('Unknown type');
    };
}

async function createBundle(bundle) {
    bundle.bundleTypes.forEach(async (type) => {
        const filename = getFilename(bundle.name, type);
        const rollupOutputConfig = {
            dir: resolve(buildDir, type.format),
            format: type.format,
            file: filename,
            sourcemap: false,
            interop: false
        };
        const rollupInputConfig = {
            input: resolve(context, bundle.entry),
            plugins: [
                resolver(),
                replace({
                    __DEV__: type.asserts
                }),
                commonjs(),
                typescript({
                    tsconfigOverride: {
                        compilerOptions: {
                            declarationDir: resolve(buildDir, bundle.typings),
                            module: 'esnext',
                        }
                    },
                    useTsconfigDeclarationDir: false,
                    clean: true
                }),
                babel({
                    plugins: [
                        resolve(__dirname, 'transform-object-assign-require')
                    ]
                }),
                type.minify && uglify()
            ],
            external: bundle.externals
        };
        const bundleKey = `${chalk.white.bold(filename)}${chalk.dim(` (${type.format.toLowerCase()})`)}`;

        try {
            console.log(`${chalk.bgYellow.black(' BUILDING ')} ${bundleKey}`);
            const result = await rollup(rollupInputConfig);
            const writer = await result.write(rollupOutputConfig);
            console.log(`${chalk.bgGreen.black(' COMPLETE ')} ${bundleKey}`);
        }
        catch (error) {
            console.log(`${chalk.bgRed.black(' OH NOES! ')} ${bundleKey}`);
            throw error;
        }
    });
}

async function build() {
    await asyncRimRaf(buildDir);
    await createBundle(bundleConfig);
}

build();
