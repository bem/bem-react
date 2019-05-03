'use strict';

const { resolve } = require('path');
const { readFileSync } = require('fs');
const { parseConfigFileTextToJson } = require('typescript');
const rimraf = require('rimraf');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');
const { rollup } = require('rollup');
const { terser } = require('rollup-plugin-terser');
const typescript2 = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');
const nodeResolve = require('rollup-plugin-node-resolve');
const stripBanner = require('rollup-plugin-strip-banner');

const { log } = console;
const packagePath = process.cwd();

function getPlugins({ isProduction, tsConfigPath }) {
    return [
        stripBanner(),
        nodeResolve(),
        replace({ __DEV__: !isProduction }),
        typescript2({
            clean: true,
            tsconfig: tsConfigPath,
            useTsconfigDeclarationDir: true,
        }),
        isProduction && terser(),
    ];
}

function getExternalDependencies(packagePath) {
    const packageJsonPath = resolve(packagePath, 'package.json');
    const content = readFileSync(packageJsonPath, 'utf-8');
    const { dependencies, peerDependencies } = JSON.parse(content);

    return [
        ...Object.keys(Object(dependencies)),
        ...Object.keys(Object(peerDependencies)),
    ];
}

function getTypescriptConfig(packagePath) {
    const tsConfigPath = resolve(packagePath, 'tsconfig.json');
    const content = readFileSync(tsConfigPath, 'utf-8');
    const { config } = parseConfigFileTextToJson(tsConfigPath, content);

    return { tsConfigPath, tsConfig: config };
}

function getPackageData(packagePath) {
    const externalDependencies = getExternalDependencies(packagePath);
    const { tsConfigPath, tsConfig } = getTypescriptConfig(packagePath);
    const packageName = packagePath.split('/').pop();
    const buildPath = resolve(packagePath, tsConfig.compilerOptions.outDir);

    return {
        externalDependencies,
        packageName,
        tsConfigPath,
        inputFile: resolve(packagePath, `${packageName}.tsx`),
        outputs: [
            {
                outputFile: resolve(buildPath, `${packageName}.production.min.js`),
                isProduction: true,
            },
            {
                outputFile: resolve(buildPath, `${packageName}.development.js`),
                isProduction: false,
            },
        ],
    };
}

function build({
    packageName,
    tsConfigPath,
    externalDependencies,
    inputFile,
    outputs,
}) {
    outputs.forEach(async ({ outputFile, isProduction }) => {
        const inputConfig = {
            input: inputFile,
            plugins: getPlugins({ isProduction, tsConfigPath }),
            external: externalDependencies,
        };

        const outputConfig = {
            file: outputFile,
            format: 'cjs',
            interop: false,
        };

        try {
            log(`❯ Building(📦): ${packageName} (${isProduction ? 'production' : 'development'})`);
            const hrstart = process.hrtime();
            const result = await rollup(inputConfig);
            const writer = await result.write(outputConfig);
            const hrend = process.hrtime(hrstart);
            const executionTime = parseInt((hrend[0] * 1e9 + hrend[1]) / 1e6, 10);
            const bundleGzipSize = prettyBytes(gzipSize.sync(writer.output[0].code));
            log(`❯ Complete(🤘): ${outputFile} (${executionTime}ms) [gzip: ${bundleGzipSize}]`);
        } catch (error) {
            log(`❯ Building(💥): ${error}`);
        }
    });
}

function cleanup(packagePath) {
    log(`❯ Cleanup: ${packagePath}`);
    const { tsConfig } = getTypescriptConfig(packagePath);
    try {
        rimraf.sync(resolve(packagePath, tsConfig.compilerOptions.outDir));
        rimraf.sync(resolve(packagePath, tsConfig.compilerOptions.declarationDir, '*.d.ts'));
    } catch (error) {
        log(`❯ Cleanup(💥): ${error}`);
    }
}

cleanup(packagePath);
build(getPackageData(packagePath));
