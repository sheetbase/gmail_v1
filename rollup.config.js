export default {
    input: './dist/esm3/public_api.js',
    output: [
        {
            file: './dist/fesm3/sheetbase-gmail.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: './dist/bundles/sheetbase-gmail.umd.js',
            format: 'umd',
            sourcemap: true,
            name: 'Gmail'
        }
    ]
};
