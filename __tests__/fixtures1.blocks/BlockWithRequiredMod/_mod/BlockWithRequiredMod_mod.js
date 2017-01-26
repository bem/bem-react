import { declMod } from 'bem-react-core';

export default declMod(({ mod }) => mod, {
    block : 'BlockWithRequiredMod',
    mods({ mod }) {
        return {
            ...this.__base.apply(this, arguments),
            mod
        };
    },
    content() {
        return [
            this.__base.apply(this, arguments),
            '2'
        ];
    }
});
