#!/bin/bash

#      ______                      _ __      __  _
#     / ____/___  ____ ___  ____  (_) /___ _/ /_(_)___  ____
#    / /   / __ \/ __ `__ \/ __ \/ / / __ `/ __/ / __ \/ __ \
#   / /___/ /_/ / / / / / / /_/ / / / /_/ / /_/ / /_/ / / / /
#   \____/\____/_/ /_/ /_/ .___/_/_/\__,_/\__/_/\____/_/ /_/
#                       /_/

rm -rf cc-src/ cc-compiled/ cc-dist/ docs/

# ------------------------------------------------------
# Angular compiler does not compile scss so I setup
# gulp to compile scss to css and then update paths
# in angular components.
# See: https://github.com/angular/closure-demo/issues/11
# ------------------------------------------------------
echo "Prepairing sources"
./node_modules/gulp/bin/gulp.js --gulpfile ./config/gulpfile.js

# ------------------------------------------------------
# Compile application typescript files to es6 closure
# compatible code (w/ JSDoc annotations).
# ------------------------------------------------------
echo "Compiling sources with angular compiler"
./node_modules/.bin/ngc -p ./tsconfig.cc.json

# ------------------------------------------------------
# Closure compile appication.
# Compilation level is ADVANCED_OPTIMIZATIONS.
# ------------------------------------------------------
echo "Minifying with closure compiler"
/usr/bin/java -jar node_modules/google-closure-compiler/compiler.jar --flagfile closure.conf

# ------------------------------------------------------
# Compile polyfills and global styles.
# ------------------------------------------------------
echo "Bundling styles and polyfills"
./node_modules/.bin/webpack-cli --config config/webpack.config.js

echo "Clearing temp directories"
rm -rf cc-src/ cc-compiled/ cc-dist/
