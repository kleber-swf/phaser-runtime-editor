const pkg = require(`./package.json`)

export default {
	input: 'src/index.js',
	output: {
		name: 'phaser-runtime-editor',
		file: pkg.main,
		format: 'umd',
		sourcemap: true
	}
}