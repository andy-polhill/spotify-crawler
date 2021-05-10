module.exports = {
    "plugins": ["jest"],
    "parser": "@babel/eslint-parser",
    "env": {
        "es2021": true,
        "node": true,
        "jest/globals": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2021,
        "sourceType": "module"
    },
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["double", 1]
    }
};
