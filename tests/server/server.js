import path from 'path';
import Express from 'express';
import qs from 'qs';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import React from 'react';
import { renderToString } from 'react-dom/server';

import Root from 'b:Root';

const app = new Express();
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

// This is fired every time the server side receives a request
app.use(handleRender);

function handleRender(req, res) {
    // Render the component to a string
    const html = renderToString(<Root />);

    // Send the rendered page back to the client
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta charset="utf-8"/>
          <!--<link rel="stylesheet" href="index.css"/>-->
      </head>
      <body>
          <div id="root">${html}</div>
          <script src="_index.js"></script>
      </body>
      </html>
    `);
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
