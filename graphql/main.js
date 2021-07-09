const AppConfig = require('./config/AppConfig');

try {
  const app = require('./app');
  app.listen(AppConfig.port);
  console.log('---------------------------------------------------------------------------');
  console.log("App listen on localhost:" + AppConfig.port);
  console.log('---------------------------------------------------------------------------');
  process.on("uncaughtexception", (err) => {
      console.error(err);
  });
}
catch (err) {
  console.log(err);
}
