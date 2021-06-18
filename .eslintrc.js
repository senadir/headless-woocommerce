module.exports = {
	extends: [ 'plugin:@woocommerce/eslint-plugin/recommended' ],
	rules: {
		'@woocommerce/dependency-group': 'off',
		'no-unused-vars': 'warn',
		'no-console': 'warn',
		camelcase: 'off',
		'jsx-a11y/autocomplete-valid': 'off',
		'no-nested-ternary': 'off',
	},
};
