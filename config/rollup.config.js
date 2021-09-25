import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';

const pkg = require('../package.json');

export default [
	{
		input: pkg.input,
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {}),
		],
		treeshake: false,
		plugins: [
			scss({
				processor: () => postcss([autoprefixer()]),
				output: 'dist/phaser-runtime-editor.css',
				outputStyle: 'compressed'
			}),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.json',
			}),
			terser()
		],
		output: [
			{
				file: pkg.main.substring(0, pkg.main.lastIndexOf('.')) + '.min.js',
				format: 'umd',
				name: pkg.module,
				exports: 'named',
				globals: {
					'phaser-ce': 'Phaser',
				},
			}
		],
	},
];
