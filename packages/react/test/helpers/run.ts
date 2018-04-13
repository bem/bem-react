export const run = (libs: { [key: string]: any }, spec: any) => {
    Object.keys(libs).forEach((libName) => {
        describe(`${libName.replace('Bem', '')}:`, spec(libs[libName]));
    });
};
