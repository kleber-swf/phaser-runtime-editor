import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
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
