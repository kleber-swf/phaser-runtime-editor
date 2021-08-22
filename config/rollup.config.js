import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

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
				file: './dist/phaser-runtime-editor.min.js',
				format: 'umd',
				name: 'PhaserRuntimeEditor',
				exports: 'named',
				globals: {
					'phaser-ce': 'Phaser',
				},
			}
		],
	},
	// {
	// 	input: pkg.input,
	// 	external: [
	// 		...Object.keys(pkg.dependencies || {}),
	// 		...Object.keys(pkg.peerDependencies || {}),
	// 	],
	// 	treeshake: false,
	// 	plugins: [
	// 		commonjs(),
	// 		typescript({
	// 			tsconfig: 'tsconfig.json',
	// 			rootDir: './src',
	// 			outDir: './dist',
	// 			declaration: true,
	// 			emitDeclarationOnly: true,
	// 			sourceMap: true,
	// 		}),
	// 	],
	// 	output: {
	// 		dir: './dist',
	// 		esModule: false,
	// 		sourcemap: true,
	// 	},
	// }
];
