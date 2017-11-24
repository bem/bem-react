module.exports = {
    setupFiles : ['./tests/setup.js'],
    moduleNameMapper : {
        'bem-react-core' : `<rootDir>/src/presets/${process.env.PRESET || 'React'}`
    }
};
