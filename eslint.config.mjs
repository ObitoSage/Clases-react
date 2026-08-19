import js from '@eslint/js';
import globals from 'globals';
export default [
{
    files: ['**/*.js'],
    languajeOptions: {
        globals: globals.browser
    }
},
    js.configs.recommended
];