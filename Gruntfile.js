module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		express: {
			www: {
				options: {
					script: "bin/www"
				}
			},
		},




		watch: {
			frontend: {
				files: [
					"views/**/*.html",
					"static/**/*.*"
				],

				options: {
					livereload: true,
				},
			},

			express: {
				files:  [
					"**/*.js",
					"bin/www",
					"!static/**/*.js"
				],
				tasks:  [ 'express:www' ],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.registerTask("start", ["express", "watch"]);
};
