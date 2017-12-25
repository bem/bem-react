
import { decl } from 'bem-react-core';
import styled from 'styled-components';

import addStyle from '../../styleHOC';

const style = Component => styled(Component)`
    color: green;
    font-weight: bold;
    font-size: ${props => props.size}
`;

export default decl({
    block : 'Example',
    content : 'Example of styled component'
}, addStyle(style));
