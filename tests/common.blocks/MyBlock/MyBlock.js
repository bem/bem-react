import {decl} from '../../../';

export default decl({
    block : 'MyBlock',
    mods({ disabled }) {
        return {
            disabled,
            a : true,
            b : 1
        };
    },
    tag : 'a',
    attrs() {
        return {
            href : '//yandex.ru',
            onClick : this.onClick.bind(this)
        }
    },
    onClick(e) {
        e.preventDefault();
        console.log('without myMod');
    },
    didMount() {
        console.log(`${this.block} is mounted`);
    }
});
