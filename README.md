# My Grunt.js workflow for front-end development

## Initial setup (Mac OS X 10.11.3)

1. Install node.js.

https://nodejs.org/en/download/

2. Install xcode command line tool.

    `xcode-select --install`

3. Install Grunt cli.

    `sudo npm install -g grunt-cli`

4. Install Compass and Sass.

    `sudo gem install sass`

    `sudo gem install compass`

5. Move to your project folder and run the following commands to set up a project.

    `npm init`
    `npm install grunt --save-dev`

6. Install necessary grunt plugins.

    `npm install "PLUGIN NAME" --save -dev`

## Update package.json and dependencies (with existing `Gruntfile.js` and `package.json` files).

1. Check which dependency needs to be updates.

    `npm oudated`

2. Install `npm-check-updates`

    `sudo npm install -g npm-check-updates`

3. Update the dependencies.

    `npm-check-updates -u`

4. Install the updated dependencies.

    `npm install`

## Grunt workflow explained.

### Folder structure

```shell
    .
    ├── index.html 
    ├── Gruntfile.js
    ├── package.json
    └── app
        ├── controllers
            └── controller.js
        ├── filters
            └── filters.js
        ├── services
            └── services.js
        ├── sass
            └── main.scss
        ├── views
            └── views.html
        └── app.js
    ├── assets
        └── css
            ├── main.css
            └── vendors
        ├── img
        └── js
            ├── app.js
            └── vendors
    ├── README.md
    └── index.html
```

### Livereload & Live-sass-compiling
The following tasks will auto-compile the SASS files and auto-reload the browser whenever I edit HTML files, SASS files, or JavaScript to reflect the changes I made.

#### [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)
```js
    connect: {
    		server: {
    			options: {
    				port: 8989,
    				host: 'localhost',
    				open: "http://localhost:8989/index.html"
    			}
    		}
    	},
```
This will start a connect web server that will work in conjunction with [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) plugin as well as [livereload](https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md#enabling-live-reload-in-your-html).

#### [grunt-contrib-compass](https://github.com/gruntjs/grunt-contrib-compass)
```js
	compass: {
		dev: {
			options: {
				sassDir: 'app/sass',
				cssDir: 'assets/css'
			}
		}
	},
```
This will compile all sass files in `app/sass` directory into CSS files in `assets/css/` directory.

#### [grunt-contrib-autoprefixer](https://github.com/nDmitry/grunt-autoprefixer)
```js
	autoprefixer: {
		build: {
			expand: true,
			flatten: true,
			src: "assets/css/main.css",
			dest: "assets/css/"
		}
	},
```
This will add necessary vendor-prefixed CSS properties.
*No separate file will be created as the source and destination are same.*

#### [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)
```js
	watch: {
		sass: {
			files: ['app/sass/*.scss'],
			tasks: ['compass:dev', 'autoprefixer:build']
		},
		livereload: {
			options: {livereload: true},
			files: ['assets/css/*.css', 'app/*/*.js', '*.html', 'app/views/*.html'],
		}
	},

```
This will watch any changes in sass files in `app/sass` directory. Whenever there is a change in those files, it will run the tasks listed in `tasks: []`. Then, this will reload any html file that is open on a connect web server whenever it detects a change in any stylesheet or JavaScript file to reflect the new changes.

#### Registering and running the watch task
Put the follwing code in `Gruntfile.js` to register the task.
```js
grunt.registerTask('default', ['connect', 'watch']);
```
Run the following command in terminal to run `connect` and `watch` tasks.

    `grunt`

### Validating Files
The following tasks will check HTML and JavaScript files and print out any errors if there are any.

#### [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)
```js
	jshint: {
		js_target: {
			src: ['app/*.js', 'app/*/*.js']
		},
		options: {
			force: true
		}
	},
```
This will validate JavaScript files and indicate any errors if there are any.

#### [grunt-htmlhint](https://github.com/yaniswang/grunt-htmlhint)
```js
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
			src: ['*.html', 'app/views/*html']
		}
	},
```
This will validate HTML files and indicate any errors if there are any.

#### Validating the HTML and JavaScript files
Register the task by putting the following code in `Gruntfile.js`.
```js
grunt.registerTask('validate', ['jshint', 'htmlhint']);
```
Run the following command in terminal to run `jshint` and `htmlhint` tasks.

    `grunt validate`

### Minifying and Deployment
The following tasks will minify CSS and JavaScript files for final deployment.

#### [grunt-cssc](https://github.com/mediapart/grunt-cssc)
```js
	cssc: {
		build: {
			options: {
				consolidateViaDeclarations: true,
				consolidateViaSelectors: true,
				consolidateMediaQueries: true
			},
			files: {
				'assets/css/main.css': 'assets/css/main.css'
			}
		}
	},
```
This task will look for any duplicate CSS rules and consolidate them to save space.

#### [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin)
```js
	cssmin: {
		build: {
			src: 'assets/css/main.css',
			dest: 'assets/css/main.css'
		}
	},
```
This will take `main.css` file in `assets/css` directory and minify the file to reduce the file size.

#### [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)
```js
	uglify: {
		my_target: {
			files: {
				'assets/js/app.js': ['assets/js/app.js']
			}
		}
	},
```
This will take `app.js` file in `assets/js/` directory and minify the file to reduce the file size.

#### Minifying files and getting them ready for final deployment.
Register the task by putting the following code in `Gruntfile.js`.
```js
grunt.registerTask('finalize', ['cssc:build', 'copy', 'cssmin:build', 'uglify', 'imagemin'])
```
*Tasks are executed in the order they are listed in the array. It is crucial that the tasks under `grunt finalize` are listed in the order specified in the code above.*

Run the following command in terminal.

    `grunt finalize`