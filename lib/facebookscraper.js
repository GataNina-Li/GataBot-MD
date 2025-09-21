/**
 * Código proporcionado desde ANIMXSCANS por github.com/reyendymion y creado por github.com/bochilTeam
 * @param {*} url
 * @return file
 * @requires cheerio
 * @requires got
 * @requires zod
 */

export async function facebookdl(url) {
let cheerio = await import('cheerio')
const DEFAULT_HEADERS = {
accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
  }
  let {default: got} = await import('got')
  const {z} = await import('zod')
  const FacebookDlArgsSchema = z.object({
    0: z.string().url()
  })
  const FacebookDlMediaSchema = z.array(
    z.object({
      quality: z.string(),
      download: z.function(z.tuple([])).returns(z.promise(z.string().url()))
    })
  )
  const FacebookDlSchema = z.object({
    thumbnail: z.string().url(),
    duration: z.string().optional(),
    video: FacebookDlMediaSchema,
    audio: FacebookDlMediaSchema
  })
  FacebookDlArgsSchema.parse(arguments)
  const html = await got('https://fdownloader.net/es', {
    headers: {
      ...DEFAULT_HEADERS
    }
  }).text()
  const k_url_search = /k_url_search="(.*?)"/.exec(html)[1]
  const k_exp = /k_exp="(.*?)"/.exec(html)[1]
  const k_token = /k_token="(.*?)"/.exec(html)[1]
  const k_prefix_name = /k_prefix_name="(.*?)"/.exec(html)[1]
  const form = {
    k_exp,
    k_token,
    q: url,
    lang: 'en',
    web: 'fdownloader.net',
    v: 'v2',
    w: ''
  }
  const data = await got
    .post(k_url_search, {
      headers: {
        ...DEFAULT_HEADERS,
        referer: 'https://fdownloader.net/'
      },
      form
    })
    .json()
  const $ = cheerio.load(data.data)
  const k_url_convert = /k_url_convert = "(.*?)"/.exec($.html())[1]
  const c_exp = /k_exp = "(.*?)"/.exec($.html())[1]
  const c_token = /c_token = "(.*?)"/.exec($.html())[1]
  const thumbnail = $('.thumbnail > .image-fb > img').attr('src')
  const duration = $('.content > .clearfix > p').text() || undefined
  const video = $('table.table')
    .eq(0)
    .find('tbody > tr')
    .map((_, el) => {
      const $el = $(el)
      const $td = $el.find('td')
      const quality = $td.eq(0).text()
      const url = $td.eq(2).find('a').attr('href')
      if (url) {
        return {
          quality,
          download: () => Promise.resolve(url)
        }
      }
      // TODO:
      return false
      const $button = $td.eq(2).find('button')
      const ftype = 'mp4'
      const v_id = $('#FbId').attr('value')
      const videoUrl = $button.attr('data-videourl')
      const videoType = $button.attr('data-videotype')
      const videoCodec = $button.attr('data-videocodec')
      const fquality = $button.attr('data-fquality')
      const audioUrl = $('#audioUrl').attr('value')
      const audioType = $('#audioType').attr('value')
    })
    .toArray()
    .filter(Boolean)
  const audio = []
  const audioUrl = $('#audioUrl').attr('value')
  audio.push({
    quality: '7kbps',
    download: () => Promise.resolve(audioUrl)
  })
  const result = {
    thumbnail,
    duration,
    video,
    audio
  }
  console.log(result)
  return FacebookDlSchema.parse(result)
}
export async function convert(url, v_id, ftype, videoUrl, videoType, videoCodec, audioUrl, audioType, fquality, fname, exp, token) {
  let {default: got} = await import('got')
  const data = await got.post(url, {
    form: {
      ftype,
      v_id,
      videoUrl,
      videoType,
      videoCodec,
      audioUrl,
      audioType,
      fquality,
      fname,
      exp,
      token,
      cv: 'v2'
    }
  })
}
