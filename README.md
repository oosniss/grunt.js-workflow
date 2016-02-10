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
    └── components
        └── sass
            └── main.scss
    ├── css
        ├── bootstrap-theme.css
        ├── bootstrap-theme.css.map
        ├── bootstrap-theme.min.css
        ├── bootstrap.css
        ├── bootstrap.css.map
        ├── bootstrap.min.css
        └── main.css
    ├── img
    ├── js
        ├── main.js
        ├── plugins.js
        └── vendor
    ├── node_modules
    └── dist    // includes final versions of files for deployment
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
				sassDir: 'components/sass',
				cssDir: 'css'
			}
		}
	},
```
This will compile all sass files in `components/sass` directory into CSS files in `css/` directory.

#### [grunt-contrib-autoprefixer](https://github.com/nDmitry/grunt-autoprefixer)
```js
	autoprefixer: {
		build: {
			expand: true,
			flatten: true,
			src: "css/main.css",
			dest: "css/"
		}
	},
```
This will add necessary vendor-prefixed CSS properties.
*No separate file will be created as the source and destination are same.*

#### [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)
```js
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

```
This will watch any changes in sass files in `components/sass` directory. Whenever there is a change in those files, it will run the tasks listed in `tasks: []`. Then, this will reload any html file that is open on a connect web server whenever it detects a change in any stylesheet or JavaScript file to reflect the new changes.

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
			src: ['js/main.js']
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
			src: ['*.html']
		}
	},
```
This will validate HTML files and indicate any errors if there are any.

#### Validating the HTML and JavaScript files
Register the task by putting the following code in `Gruntfile.js`.
```js
grunt.registerTask('validate', ['jshint', 'htmlhint']);
```
Run the following command in terminal to run `jshin` and `htmlhin` tasks.

    `grunt validate`

### Minifying and Deployment
The following tasks will minify CSS and JavaScript files and copy all the necessary files in a new `dist` directory for final deployment.

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
				'dist/css/main.css': 'css/main.css'
			}
		}
	},
```
This task will look for any duplicate CSS rules and consolidate them to save space.
This will also output the result in a new directory `dist/css/`.

#### [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy)
```js
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
```
This will copy all the essential files and paste them in `dist` directory, which will eventually contain final versions of all files to be deployed.

#### [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin)
```js
	cssmin: {
		build: {
			src: 'dist/css/main.css',
			dest: 'dist/css/main.css'
		}
	},
```
This will take `main.css` file in `dist/css/` directory, which has been copied to this directory by `grunt-contrib-copy` task, and minify the file to reduce the file size.

#### [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)
```js
	uglify: {
		my_target: {
			files: {
				'dist/js/main.js': ['dist/js/main.js']
			}
		}
	},
```
This will take `main.js` file in `dist/css/` directory, which has been copied to this directory by `grunt-contrib-copy` task, and minify the file to reduce the file size.

#### [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)
```js
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
```
This will take all the image files in `img/` directory, minimize them, and place them in `dist/img/` directory for final deployment.

#### Minifying files and getting them ready for final deployment.
Register the task by putting the following code in `Gruntfile.js`.
```js
grunt.registerTask('finalize', ['cssc:build', 'copy', 'cssmin:build', 'uglify', 'imagemin'])
```
*Tasks are executed in the order they are listed in the array. It is crucial that the tasks under `grunt finalize` are listed in the order specified in the code above.*

Run the following command in terminal.

    `grunt finalize`

A new directory `dist` will be created with all the necessary files for deployment in it.
