const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

const { NODE_ENV } = process.env;

configure({ adapter: new Adapter() });

global.__DEV__ = NODE_ENV === 'test';
