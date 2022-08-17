import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo')

export async function getStore(filename: string) {
  if (!fs.existsSync(path.resolve(__dirname, 'cache', filename))) {
    throw new Error('cache does not exists')
  }

  const cache = fs.readFileSync(path.resolve(__dirname, 'cache', filename), {
    encoding: 'utf8'
  })

  const data = JSON.parse(cache)

  const is_expired = dayjs().isAfter(data.expires_in * 1000)
  if (is_expired) {
    throw new Error('cache is expired')
  }

  return data
}

export async function setStore(
  data: any,
  filename: string,
  expires_in: number
) {
  const cache = JSON.stringify({
    data,
    expires_in
  })

  fs.mkdirSync(path.resolve(__dirname, 'cache'))

  fs.writeFileSync(path.resolve(__dirname, 'cache', filename), cache, {
    flag: 'a+'
  })

  return {
    data,
    expires_in
  }
}
