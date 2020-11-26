module.exports = {
    'parser': 'babel-eslint',
    'extends': 'airbnb',
    'plugins': [
        'react',
        'import',
    ],
    'rules': {
        'semi': [0],
        'react/prop-types': [0],
        'no-underscore-dangle': [0],
        'no-script-url': [0],
        'max-len': [2, 150],
        'comma-dangle': [2, {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'always-multiline',
            'functions': 'ignore',
        }],
        'camelcase': [0],
        'arrow-body-style': [0],
        'indent': [2, 4, {
            'SwitchCase': 1,
        }],
        'quote-props': [2, 'consistent'],
        'no-plusplus': [2, {
            'allowForLoopAfterthoughts': true
        }],
        'no-unused-expressions': [2, {
            'allowShortCircuit': true
        }],
        'import/no-extraneous-dependencies': [0],
        'import/no-unresolved': [0],
        'import/extensions': [0],
        'import/prefer-default-export': [0],
        'react/self-closing-comp': [0],
        'react/prefer-stateless-function': [0],
        'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-boolean-value': [2, 'always'],
        'global-require': [0],
        'jsx-a11y/href-no-hash': [0],
        'linebreak-style': [0], // Severity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed 'false').
    },
    'globals': {
        'document': false,
        'window': false,
        'fetch': false,
        /**
         *  jest global variable
         */
        'jest': false,
        'describe': false,
        'it': false,
        'expect': false,
        'beforeEach': false,
        'afterEach': false,
    },
};
