import { Bem } from 'bem-react-core';
import MyBlock from 'b:MyBlock';
import MyBlockElem from 'b:MyBlock e:Elem';
import SimpleInheritedBlock from 'b:SimpleInheritedBlock';

it('Should properly set displayName for declared block', () => {
    expect(MyBlock.displayName).toBe('MyBlock');
});

it('Should properly set displayName for declared elem', () => {
    expect(MyBlockElem.displayName).toBe('MyBlock-Elem');
});

it('Should properly set displayName for simple entity', () => {
    expect(Bem.displayName).toBe('Bem');
});

it('Should properly set displayName for inherited block', () => {
    expect(SimpleInheritedBlock.displayName).toBe('SimpleInheritedBlock');
});
