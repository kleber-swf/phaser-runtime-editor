import typescript from '@rollup/plugin-typescript';

const pkg = require('../package.json');

export default {
	input: pkg.input,
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	treeshake: false,
	plugins: [
		typescript({
			rootDir: './src',
			tsconfig: 'tsconfig.json',
			outDir: './dist',
			declaration: true,
			declarationMap: true,
			sourceMap: true,
		}),
	],
	output: {
		dir: './dist',
		format: 'umd',
		name: pkg.module,
		esModule: false,
		exports: 'named',
		sourcemap: true,
		globals: {
			'phaser-ce': 'Phaser',
		},
	},
};
