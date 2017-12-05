const delim = '$';

module.exports = {
    stringify({ block, elem }) {
        return `${block}${delim}${elem}`;
    },
    parse(id) {
        const entity = id.split(delim);
        return {
            block : entity[0],
            elem : entity[1] === 'undefined' ? undefined : entity[1]
        };
    }
};
