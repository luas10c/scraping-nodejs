import axios from 'axios'
import express from 'express'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { load } from 'cheerio'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo')

import * as cache from './cache'

interface Args {
  enable_cache?: boolean
}

async function getStaticts(args: Args) {
  const { enable_cache } = args
  if (enable_cache) {
    try {
      const cacheExists = await cache.getStore('staticts.cache')
      return cacheExists
    } catch (error) {
      const { data: response } = await axios.get(
        'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419'
      )
      const $ = load(response)

      const doses_aplicadas = $(
        '.kSCnAc:nth-child(3) .tZjT9b:nth-child(1) .fNm5wd:nth-child(1) .UvMayb'
      ).html()

      const casos_brasil = $('tbody tr:nth-child(4) .l3HOY:nth-child(2)').html()

      const data = await cache.setStore(
        { doses_aplicadas, casos_brasil },
        'staticts.cache',
        dayjs().utc(true).add(24, 'hours').unix()
      )
      return data
    }
  }

  const { data: response } = await axios.get(
    'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419'
  )
  const $ = load(response)

  const doses_aplicadas = $(
    '.kSCnAc:nth-child(3) .tZjT9b:nth-child(1) .fNm5wd:nth-child(1) .UvMayb'
  ).html()

  const casos_brasil = $('tbody tr:nth-child(4) .l3HOY:nth-child(2)').html()

  return {
    doses_aplicadas,
    casos_brasil
  }
}

const app = express()

app.use('/', async (_, response) => {
  const data = await getStaticts({ enable_cache: true })
  return response.json(data)
})

app.listen(3000)
