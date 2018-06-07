module.exports = {
    setupFiles : ['./tests/setup.js'],
    testPathIgnorePatterns : ['./examples', 'node_modules'],
    moduleNameMapper : {
        'bem-react-core' : process.env.CI ? '<rootDir>' : `<rootDir>/src/presets/${process.env.PRESET || 'React'}`
    }
};
