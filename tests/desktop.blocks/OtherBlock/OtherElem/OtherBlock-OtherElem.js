import {decl} from 'bem-react-core';
import MyBlock from 'b:MyBlock';
import MyElem from 'b:MyBlock e:MyElem';

export default decl({
  block: 'OtherBlock',
  elem: 'OtherElem',
  content() {
    return <MyElem />;
  }
});
