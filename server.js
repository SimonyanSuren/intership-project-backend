require('dotenv').config();
require('express-async-error');
//express
const express = require('express');
const app = express();

//packages
const cookieParser = require('cookie-parser');

//database
const { sequelize } = require('./src/api/v1/models');

//routers
const routes = require('./src/api/v1/routes/index.route');

//middleware
const notFoundMiddleware = require('./src/api/v1/middleware/notFound.middleware');
const errorHandlerMiddleware = require('./src/api/v1/middleware/errorHandler.middleware');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1', routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connected!');
    app.listen(port, () => {
      console.log(`Server up on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
