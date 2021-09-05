// (Cloned from CRA)
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react', 'react-hooks', '@typescript-eslint'],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
  },

  // overrides: [
  // {
  // files: ['**/*.ts?(x)'],
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  // ecmaVersion: 2018,
  // sourceType: 'module',
  // ecmaFeatures: {
  //   jsx: true,
  // },

  //       // typescript-eslint specific options
  //       warnOnUnsupportedTypeScriptVersion: true,
  //     },
  //     plugins: ['@typescript-eslint'],
  //     // If adding a typescript-eslint version of an existing ESLint rule,
  //     // make sure to disable the ESLint rule here.
  // rules: {
  //       // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
  //       'default-case': 'off',
  //       // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
  //       'no-dupe-class-members': 'off',
  //       // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
  //       'no-undef': 'off',

  //       // Add TypeScript specific rules (and turn off ESLint equivalents)
  //       '@typescript-eslint/consistent-type-assertions': 'warn',
  //       'no-array-constructor': 'off',
  //       '@typescript-eslint/no-array-constructor': 'warn',
  //       'no-redeclare': 'off',
  //       // '@typescript-eslint/no-redeclare': 'warn',
  //       'no-use-before-define': 'off',
  //       '@typescript-eslint/no-use-before-define': [
  //         'warn',
  //         {
  //           functions: false,
  //           classes: false,
  //           variables: false,
  //           typedefs: false,
  //         },
  //       ],
  //       'no-unused-expressions': 'off',
  //       '@typescript-eslint/no-unused-expressions': [
  //         'error',
  //         {
  //           allowShortCircuit: true,
  //           allowTernary: true,
  //           allowTaggedTemplates: true,
  //         },
  //       ],
  //       'no-unused-vars': 'off',
  //       '@typescript-eslint/no-unused-vars': [
  //         'warn',
  //         {
  //           args: 'none',
  //           ignoreRestSiblings: true,
  //         },
  //       ],
  //       'no-useless-constructor': 'off',
  //       '@typescript-eslint/no-useless-constructor': 'warn',
  // },
  // },
  // ],

  // // NOTE: When adding rules here, you need to make sure they are compatible with
  // // `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
  // rules: {
  //   // http://eslint.org/docs/rules/
  //   'array-callback-return': 'warn',
  //   'default-case': ['warn', { commentPattern: '^no default$' }],
  //   'dot-location': ['warn', 'property'],
  //   eqeqeq: ['warn', 'smart'],
  //   'new-parens': 'warn',
  //   'no-array-constructor': 'warn',
  //   'no-caller': 'warn',
  //   'no-cond-assign': ['warn', 'except-parens'],
  //   'no-const-assign': 'warn',
  //   'no-control-regex': 'warn',
  //   'no-delete-var': 'warn',
  //   'no-dupe-args': 'warn',
  //   'no-dupe-class-members': 'warn',
  //   'no-dupe-keys': 'warn',
  //   'no-duplicate-case': 'warn',
  //   'no-empty-character-class': 'warn',
  //   'no-empty-pattern': 'warn',
  //   'no-eval': 'warn',
  //   'no-ex-assign': 'warn',
  //   'no-extend-native': 'warn',
  //   'no-extra-bind': 'warn',
  //   'no-extra-label': 'warn',
  //   'no-fallthrough': 'warn',
  //   'no-func-assign': 'warn',
  //   'no-implied-eval': 'warn',
  //   'no-invalid-regexp': 'warn',
  //   'no-iterator': 'warn',
  //   'no-label-var': 'warn',
  //   'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
  //   'no-lone-blocks': 'warn',
  //   'no-loop-func': 'warn',
  //   'no-mixed-operators': [
  //     'warn',
  //     {
  //       groups: [
  //         ['&', '|', '^', '~', '<<', '>>', '>>>'],
  //         ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
  //         ['&&', '||'],
  //         ['in', 'instanceof'],
  //       ],
  //       allowSamePrecedence: false,
  //     },
  //   ],
  //   'no-multi-str': 'warn',
  //   'no-native-reassign': 'warn',
  //   'no-negated-in-lhs': 'warn',
  //   'no-new-func': 'warn',
  //   'no-new-object': 'warn',
  //   'no-new-symbol': 'warn',
  //   'no-new-wrappers': 'warn',
  //   'no-obj-calls': 'warn',
  //   'no-octal': 'warn',
  //   'no-octal-escape': 'warn',
  //   'no-redeclare': 'warn',
  //   'no-regex-spaces': 'warn',
  //   'no-restricted-syntax': ['warn', 'WithStatement'],
  //   'no-script-url': 'warn',
  //   'no-self-assign': 'warn',
  //   'no-self-compare': 'warn',
  //   'no-sequences': 'warn',
  //   'no-shadow-restricted-names': 'warn',
  //   'no-sparse-arrays': 'warn',
  //   'no-template-curly-in-string': 'warn',
  //   'no-this-before-super': 'warn',
  //   'no-throw-literal': 'warn',
  //   'no-undef': 'error',
  //   'no-unreachable': 'warn',
  //   'no-unused-expressions': [
  //     'error',
  //     {
  //       allowShortCircuit: true,
  //       allowTernary: true,
  //       allowTaggedTemplates: true,
  //     },
  //   ],
  //   'no-unused-labels': 'warn',
  //   'no-unused-vars': [
  //     'warn',
  //     {
  //       args: 'none',
  //       ignoreRestSiblings: true,
  //     },
  //   ],
  //   'no-use-before-define': [
  //     'warn',
  //     {
  //       functions: false,
  //       classes: false,
  //       variables: false,
  //     },
  //   ],
  //   'no-useless-escape': 'warn',
  //   'no-useless-rename': [
  //     'warn',
  //     {
  //       ignoreDestructuring: false,
  //       ignoreImport: false,
  //       ignoreExport: false,
  //     },
  //   ],
  //   'no-with': 'warn',
  //   'no-whitespace-before-property': 'warn',
  //   'react-hooks/exhaustive-deps': 'warn',
  //   'require-yield': 'warn',
  //   'rest-spread-spacing': ['warn', 'never'],
  //   strict: ['warn', 'never'],
  //   'unicode-bom': ['warn', 'never'],
  //   'use-isnan': 'warn',
  //   'valid-typeof': 'warn',
  //   'no-restricted-properties': [
  //     'error',
  //     {
  //       object: 'require',
  //       property: 'ensure',
  //       message:
  //         'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
  //     },
  //     {
  //       object: 'System',
  //       property: 'import',
  //       message:
  //         'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
  //     },
  //   ],
  //   'getter-return': 'warn',

  //   // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
  //   'import/first': 'error',
  //   'import/no-amd': 'error',
  //   // 'import/no-anonymous-default-export': 'warn',
  //   'import/no-webpack-loader-syntax': 'error',

  //   // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
  //   'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
  //   'react/jsx-no-target-blank': 'warn',
  //   'react/jsx-no-undef': 'error',
  //   'react/jsx-pascal-case': [
  //     'warn',
  //     {
  //       allowAllCaps: true,
  //       ignore: [],
  //     },
  //   ],
  //   'react/no-danger-with-children': 'warn',
  //   // Disabled because of undesirable warnings
  //   // See https://github.com/facebook/create-react-app/issues/5204 for
  //   // blockers until its re-enabled
  //   // 'react/no-deprecated': 'warn',
  //   'react/no-direct-mutation-state': 'warn',
  //   'react/no-is-mounted': 'warn',
  //   'react/no-typos': 'error',
  //   'react/require-render-return': 'error',
  //   'react/style-prop-object': 'warn',

  //   // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
  //   'react-hooks/rules-of-hooks': 'error',

  //   'react/jsx-uses-vars': 'warn',
  //   'react/jsx-uses-react': 'warn',
  // },
};
