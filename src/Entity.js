const delim = '$';

export function tokenize({ block, elem }) {
    return `${block}${delim}${elem}`;
};

export function parse(id) {
    const entity = id.split(delim);
    return {
        block : entity[0],
        elem : entity[1] === 'undefined' ? undefined : entity[1]
    };
};
