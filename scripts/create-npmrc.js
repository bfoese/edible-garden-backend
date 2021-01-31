// Used in production to install npm private modules
// https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process
// if (process.env.NODE_ENV !== 'production') {
//   return;
// }

// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require('fs');
fs.writeFileSync('.npmrc', '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\r\n@bfoese:registry=https://npm.pkg.github.com/\r\n//npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}');
fs.chmodSync('.npmrc', '600');
