import { Elysia, t } from 'Elysia'
import { html } from '@elysia/html'

const paths = {index: './index.html', names: './names.html'}
const files = {
  index: Bun.file(paths.index),
  names: Bun.file(paths.names)
}

const server = new Elysia().use(html())

server.get('/', () => {
  return new Response(files.index)
})

server.get('/index', () => {
  return new Response(files.index)
})

server.get('/index.html', () => {
  return new Response(files.index)
})

server.get('/names.html', () => {
  return new Response(files.index)
})

server.listen(3003)

/*
const server = Bun.serve({
  port: 3003,
  fetch() {
    return resp // new Response('Bun!')
  }
})
*/

console.log(`Listening on http://localhost:${server.port} ...`)

