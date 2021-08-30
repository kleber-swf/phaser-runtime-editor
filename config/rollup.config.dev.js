import typescript from '@rollup/plugin-typescript';
import postcssUrl from 'postcss-url';
import browserSync from 'rollup-plugin-browsersync';
import postcss from 'rollup-plugin-postcss';

const pkg = require('../package.json');
const bsConfig = require('./bs-config');

export default {
	input: pkg.input,
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	treeshake: false,
	plugins: [
		postcss({
			extract: 'phaser-runtime-editor-styles.css',
			// minimize: true,

			modules: {
				generateScopedName: "[hash:base64:5]"
			},
			plugins: [
				postcssUrl({ url: 'inline' })
			]
		}),
		typescript({
			rootDir: './src',
			tsconfig: 'tsconfig.json',
			outDir: './dist',
			declaration: true,
			declarationMap: true,
			sourceMap: true,
		}),
		browserSync(bsConfig),
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
