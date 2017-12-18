module.exports = {
    setupFiles : ['./tests/setup.js'],
    moduleNameMapper : {
        'bem-react-core' : process.env.CI ? '<rootDir>' : `<rootDir>/src/presets/${process.env.PRESET || 'React'}`
    }
};
