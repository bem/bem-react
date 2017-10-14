import PropTypes from 'proptypes';
import MyBlock from 'b:MyBlock m:theme=simple';
import InheritedBlock from 'b:InheritedBlock';

describe('contextTypes', () => {
    it('Should be merged for modifier', () => {
        expect(MyBlock.contextTypes).toMatchObject({
            context0 : PropTypes.string,
            context1 : PropTypes.bool,
            context2 : PropTypes.string
        });
    });

    it('Should be merged for levels', () => {
        expect(MyBlock.contextTypes).toMatchObject({
            context0 : PropTypes.string,
            context1 : PropTypes.bool,
            context3 : PropTypes.string
        });
    });

    it('Should be merged for inherited', () => {
        expect(InheritedBlock.contextTypes).toMatchObject({
            context0 : PropTypes.string,
            context1 : PropTypes.bool,
            context4 : PropTypes.string
        });
    });
});

describe('childContextTypes', () => {
    it('Should be merged for modifier', () => {
        expect(MyBlock.childContextTypes).toMatchObject({
            context0 : PropTypes.string,
            context1 : PropTypes.bool,
            context2 : PropTypes.string
        });
    });

    it('Should be merged for levels', () => {
        expect(MyBlock.childContextTypes).toMatchObject({
            context0 : PropTypes.string,
            context1 : PropTypes.bool,
            context3 : PropTypes.string
        });
    });

    it('Should be merged for inherited', () => {
        expect(InheritedBlock.childContextTypes).toMatchObject({
            context0 : PropTypes.string,
            context1 : PropTypes.bool,
            context4 : PropTypes.string
        });
    });
});
