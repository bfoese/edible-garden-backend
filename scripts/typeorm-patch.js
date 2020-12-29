module.exports = {
  files: ['./node_modules/.bin/typeorm', './node_modules/.bin/typeorm.*'],
  from: [/@bfoese\/typeorm/g, /@bfoese\\typeorm/g],
  to: 'typeorm',
};
