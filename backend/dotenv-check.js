require('dotenv').config();
console.log(JSON.stringify({
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL
}, null, 2));