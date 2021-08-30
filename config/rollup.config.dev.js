import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import browserSync from 'rollup-plugin-browsersync';
import scss from 'rollup-plugin-scss';

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
		scss({
			processor: () => postcss([autoprefixer()]),
			output: 'dist/phaser-runtime-editor-styles.css',
			// outputStyle: 'compressed'
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
