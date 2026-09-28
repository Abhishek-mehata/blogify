change index.js to app.js for aws

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "commonjs",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^18.0.4",
    "ejs": "^6.0.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.10.1",
    "multer": "^2.4.0",
    "tailwindcss": "^4.3.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```


use the professinal env variables 
```js
const PORT = process.env.PORT || 8000

// connect db
mongoose.connect(process.env.MONGO_URL)
    .then((e) => {
        console.log("Mongodb Conected Successfully")
    }).catch((e) => {
        console.log("Database connection failed")
    });
```




- go to console.aws.com
create a free account on aws
