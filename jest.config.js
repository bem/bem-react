module.exports = {
    rootDir: `./packages/${process.env.PKG}`,
    testPathIgnorePatterns : ['node_modules'],
    moduleFileExtensions : ['ts', 'tsx', 'js'],
    setupFiles: [
        `./test/setup/index.js`
    ],
    transform : {
        '^.+\\.(ts|tsx)$' : 'ts-jest'
    },
    testMatch : [
        `**/test/*.+(ts|tsx)`,
        `**/test/*.+(ts|tsx)`
    ],
};
