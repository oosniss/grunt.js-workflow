module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-htmlhint');
	grunt.loadNpmTasks('grunt-cssc');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

/* Watch Tasks */
		// server
		connect: {
			server: {
				options: {
					port: 8989,
					host: 'localhost',
					open: "http://localhost:8989/index.html"
				}
			}
		},
		// compass
		compass: {
			dev: {
				options: {
					sassDir: 'components/sass',
					cssDir: 'css'
				}
			}
		},
		// autoprefixer
		autoprefixer: {
			build: {
				expand: true,
				flatten: true,
				src: "css/main.css",
				dest: "css/"
			}
		},
		// watch
		watch: {
			sass: {
				files: ['components/sass/*.scss'],
				tasks: ['compass:dev', 'autoprefixer:build']
			},
			livereload: {
				options: {livereload: true},
				files: ['css/*.css', 'js/*.js', '*.html', 'img/*'],
			}
		},
		
/* Validating Tasks */
		// jshint
		jshint: {
			js_target: {
				src: ['js/main.js']
			},
			options: {
				force: true
			}
		},
		// htmlhint
		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'spec-char-escape': true,
					'id-unique': true
				},
				src: ['*.html']
			}
		},

/* Finalizing Tasks */
		// css consolidate
		cssc: {
			build: {
				options: {
					consolidateViaDeclarations: true,
					consolidateViaSelectors: true,
					consolidateMediaQueries: true
				},
				files: {
					'dist/css/main.css': 'css/main.css'
				}
			}
		},
		// copy
		copy: {
			main: {
				files: [{
					expand: true,
					src: '*.html',
					dest: 'dist/'
				},
				{
					expand: true,
					src: 'css/**',
					dest: 'dist/'
				},
				{
					expand: true,
					src: 'js/**',
					dest: 'dist/'
				}]
			}
		},
		// minify
		cssmin: {
			build: {
				src: 'dist/css/main.css',
				dest: 'dist/css/main.css'
			}
		},
		uglify: {
			my_target: {
				files: {
					'dist/js/main.js': ['dist/js/main.js']
				}
			}
		},
		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					src: ['img/*.{png,jpg,jpeg,gif,ico}'],
					dest: 'dist/'
				}]
			}
		}
	});

	grunt.registerTask('default', ['connect', 'watch']);
	grunt.registerTask('validate', ['jshint', 'htmlhint']);
	grunt.registerTask('finalize', ['cssc:build', 'copy', 'cssmin:build', 'uglify', 'imagemin']);
};
