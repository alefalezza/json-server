
import { App } from '@tinyhttp/app';

import { isItem, Service } from './service.js';

export default (app: App) => {

  const service = app.locals['service'] as Service;
  
  app.get('/:name', (req, res, next) => {
    const { name = '' } = req.params
    const query = Object.fromEntries(
      Object.entries(req.query)
        .map(([key, value]) => {
          if (
            ['_start', '_end', '_limit', '_page', '_per_page'].includes(key) &&
            typeof value === 'string'
          ) {
            return [key, parseInt(value)]
          } else {
            return [key, value]
          }
        })
        .filter(([, value]) => !Number.isNaN(value)),
    )
    res.locals['data'] = service.find(name, query)
    next?.()
  })

  app.get('/:name/:id', (req, res, next) => {
    const { name = '', id = '' } = req.params
    res.locals['data'] = service.findById(name, id, req.query)
    next?.()
  })

  app.post('/:name', async (req, res, next) => {
    const { name = '' } = req.params
    if (isItem(req.body)) {
      res.locals['data'] = await service.create(name, req.body)
    }
    next?.()
  })

  app.put('/:name', async (req, res, next) => {
    const { name = '' } = req.params
    if (isItem(req.body)) {
      res.locals['data'] = await service.update(name, req.body)
    }
    next?.()
  })

  app.put('/:name/:id', async (req, res, next) => {
    const { name = '', id = '' } = req.params
    if (isItem(req.body)) {
      res.locals['data'] = await service.updateById(name, id, req.body)
    }
    next?.()
  })

  app.patch('/:name', async (req, res, next) => {
    const { name = '' } = req.params
    if (isItem(req.body)) {
      res.locals['data'] = await service.patch(name, req.body)
    }
    next?.()
  })

  app.patch('/:name/:id', async (req, res, next) => {
    const { name = '', id = '' } = req.params
    if (isItem(req.body)) {
      res.locals['data'] = await service.patchById(name, id, req.body)
    }
    next?.()
  })

  app.delete('/:name/:id', async (req, res, next) => {
    const { name = '', id = '' } = req.params
    res.locals['data'] = await service.destroyById(
      name,
      id,
      req.query['_dependent'],
    )
    next?.()
  })

  app.use('/:name', (req, res) => {
    const { data } = res.locals
    if (data === undefined) {
      res.sendStatus(404)
    } else {
      if (req.method === 'POST') res.status(201)
      res.json(data)
    }
  })
}