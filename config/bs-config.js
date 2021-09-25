// Browser sync configuration file for the example project
module.exports = {
	server: ['./example'],
	serveStatic: [
		{
			route: '/js',
			dir: [
				'./dist',
				'./node_modules/phaser-ce/build'
			],
		},
		{
			route: '/src',
			dir: ['./src']
		}
	],
	files: [
		'./dist/index.js',
		'./example/**/*.*'
	],
	ghostMode: false,
	open: false,
};