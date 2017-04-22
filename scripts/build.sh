browserify src/js/bundle.js -o static/js/bundle.js
cp -r static/* dist/
version=$(<version)
tar -cvzf moonwalker.$version.tar.gz -C dist .
