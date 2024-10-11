import { App } from "@tinyhttp/app";

export default (app: App) => {
  console.log("middleware loaded");
  app.get('/login',
    function (req, res) {
      res.send("Hello world");
    });
};