const MyConstants = {
  DB_SERVER: 'cluster0.dbwymd7.mongodb.net',
  DB_USER: 'kha',
  DB_PASS: '123',
  DB_DATABASE: 'shoppingonline',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'hotmail',
  EMAIL_USER: process.env.EMAIL_USER || '<email_user>',
  EMAIL_PASS: process.env.EMAIL_PASS || '<email_pass>',
  JWT_SECRET: 'abciooiqwe',
  JWT_EXPIRES: '356658435644111',
};

module.exports = MyConstants;
