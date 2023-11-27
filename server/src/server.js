// server.js

import express from 'express'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from '../../client/src/App'
import { query } from '../db'
import userRoutes from './routes/user'

try {
  await query('DROP TABLE IF EXISTS users')
  await query(
    'CREATE TABLE users (id SERIAL PRIMARY KEY, firstName varchar(255) , lastName varchar(255), email varchar(255) unique NOT NULL)',
  )
  await query(`
    INSERT INTO users (firstName, lastName, email) VALUES('john', 'doe', 'john.doe@gmail.com');
    INSERT INTO users (firstName, lastName, email) VALUES('jane', 'doe', 'jane.doe@gmail.com');
  `)
} catch (e) {
  console.log(e)
}

const app = express()
app.use(express.json())
app.use(express.static(`build`))

app.use('/', userRoutes)

app.get('*', (req, res) => {
  const context = {}
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>,
  )

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        >
        <title>Isomorphic React App</title>
      </head>
      <body>
        <div id="root">${html}</div>

        <script>
        window.__INITIAL_DATA__ = { users: ${JSON.stringify([
          {
            id: 0,
            firstName: 'john',
            lastName: 'doe',
            email: 'john.doe@gmail.com',
          },
        ])} }
        </script>

        <script type="text/javascript" src="/client.bundle.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000, () => console.log('Listening on port 3000'))
