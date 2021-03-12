try {
  const app = require('./app');
  app.listen(8080);

  console.log("App listen on localhost:8080");
}
catch (err) {
  console.log(err);
}
