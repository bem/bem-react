import { h } from 'preact';
import { decl } from 'bem-react-core';

export default decl({
    block : 'BlockWithWrapDecl',
    attrs(props) {
        return props;
    }
}, function(Self) {
    return function(props) {
        const prp = { ...props, tabIndex : '-1' };
        return <Self {...prp}/>;
    };
});
