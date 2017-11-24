require('raf/polyfill');
const { configure } = require('enzyme');
const Adapter = require(`enzyme-adapter-react-${process.env.REACT_MAJOR || 16}`);

configure({ adapter : new Adapter() });
