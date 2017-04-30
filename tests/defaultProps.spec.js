import MyBlock from 'b:MyBlock m:theme=simple';
import InheritedBlock from 'b:InheritedBlock';

it('Should merge defaultProps for modifier', () => {
    expect(MyBlock.defaultProps).toMatchObject({
        disabled : false,
        size : 'm'
    });
});

it('Should merge defaultProps for inherited', () => {
    expect(InheritedBlock.defaultProps).toMatchObject({
        disabled : false,
        checked : false
    });
});

it('Should merge defaultProps for levels', () => {
    expect(MyBlock.defaultProps).toMatchObject({
        disabled : false,
        a11y : false
    });
});
