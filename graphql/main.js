const AppConfig = require('./config/AppConfig');

try {
  const app = require('./app');
  app.listen(AppConfig.port);

  console.log("App listen on localhost:" + AppConfig.port);
}
catch (err) {
  console.log(err);
}
