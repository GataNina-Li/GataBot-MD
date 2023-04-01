<p align="center">
<img src="https://avatars0.githubusercontent.com/u/4674786?s=400&u=2f77d382a4428c141558772a2b7ad3a36bebf5bc&v=4" width="128" height="128"/>
</p>
<p align="center">
<a href="#"><img title="FB-DOWNLOADER-SCRAPPER" src="https://img.shields.io/badge/-FB--DOWNLOADER--SCRAPPER-blue?style=for-the-badge"></a>
</p>
<p align="center">
<a href="https://github.com/victorsouzaleal"><img title="Autor" src="https://img.shields.io/badge/Author-victorsouzaleal-blue.svg?style=for-the-badge&logo=github"></a>
</p>
</p>
<p align="center">
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fvictorsouzaleal%2Ffb-downloader-scrapper&count_bg=%23007EC6&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=true"/></a>
<a href="#"><img title="Version" src="https://img.shields.io/github/package-json/v/victorsouzaleal/fb-downloader-scrapper?color=blue&logo=github&style=flat-square"></a>
<a href="#"><img title="Size" src="https://img.shields.io/bundlephobia/min/fb-downloader-scrapper?color=blue&logo=npm&style=flat-square"></a>
<a href="https://github.com/victorsouzaleal/fb-downloader-scrapper/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/victorsouzaleal/fb-downloader-scrapper?color=blue&logo=github&style=flat-square"></a>
<a href="https://github.com/victorsouzaleal/fb-downloader-scrapper/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/victorsouzaleal/fb-downloader-scrapper?color=blue&logo=github&style=flat-square"></a>
<a href="#"><img title="MAINTENED" src="https://img.shields.io/badge/MAINTENED-YES-blue?style=flat-square"/></a>
</p>

## Instalation :
```bash
> npm i --save fb-downloader-scrapper
```

## Example
```js
const fbDownloader = require("fb-downloader-scrapper")
let response = await fbDownloader("https://www.facebook.com/FoodMakersBr/videos/tire-o-feij%C3%A3o-do-pote-de-sorvete-e-fa%C3%A7a-essa-receita-ainda-hoje/454262112817834/")
console.log(response)
```

## Output Example - Success
```
{
    success: true,
    video_length: 189, (seconds)
    download: [
        {
        quality: '720p (HD)',
        url: 'https://video-gru2-1.xx.fbcdn.net/v/t66.36240-2/10000000_913547206706438_4873834930706687819_n.mp4?_nc_cat=107&ccb=1-7&_nc_sid=985c63&efg=eyJybHIiOjM0MzIsInJsYSI6NDA5NiwidmVuY29kZV90YWciOiJvZXBfaGQifQ%3D%3D&_nc_ohc=02M65sakwW8AX_rk_S1&rl=3432&vabr=2288&_nc_ht=video-gru2-1.xx&oh=00_AT9ZGsW3KRzyFjH3B-ycYAk6uGra1H0GP8_lsu0e4XUXLg&oe=62DBD4C3&dl=1'
        },
        {
        quality: '360p (SD)',
        url: 'https://video-gru2-1.xx.fbcdn.net/v/t39.25447-2/293084166_142372768441770_7337640311744199678_n.mp4?_nc_cat=109&vs=8adc955fda408d6d&_nc_vs=HBksFQAYJEdBWWNlQkdxNVVtX2ZJRUFBUDU3R2EtOGlOUmxibWRqQUFBRhUAAsgBABUAGCRHQUtDYkJHUk9TSlNzNXdDQUstXzZfTHI4UjRLYnJGcUFBQUYVAgLIAQBLBogScHJvZ3Jlc3NpdmVfcmVjaXBlATENc3Vic2FtcGxlX2ZwcwAQdm1hZl9lbmFibGVfbnN1YgAgbWVhc3VyZV9vcmlnaW5hbF9yZXNvbHV0aW9uX3NzaW0AKGNvbXB1dGVfc3NpbV9vbmx5X2F0X29yaWdpbmFsX3Jlc29sdXRpb24AEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcAAAm6LX08trDhAIVAigCQzMYC3Z0c19wcmV2aWV3HBdAZ7LhR64UexggZGFzaF92NF81c2VjZ29wX2hxMV9mcmFnXzJfdmlkZW8SABgYdmlkZW9zLnZ0cy5jYWxsYmFjay5wcm9kOBJWSURFT19WSUVXX1JFUVVFU1QbCogVb2VtX3RhcmdldF9lbmNvZGVfdGFnBm9lcF9zZBNvZW1fcmVxdWVzdF90aW1lX21zATAMb2VtX2NmZ19ydWxlCnNkX3VubXV0ZWQTb2VtX3JvaV9yZWFjaF9jb3VudAc1MTQwNDM2EW9lbV9pc19leHBlcmltZW50AAxvZW1fdmlkZW9faWQPNDU0MjYyMTEyODE3ODM0Em9lbV92aWRlb19hc3NldF9pZBAxMTkxMjA0OTIxNDUzNDgyFW9lbV92aWRlb19yZXNvdXJjZV9pZA81NzI5MDkyOTc3NjU3NDgcb2VtX3NvdXJjZV92aWRlb19lbmNvZGluZ19pZBAyMDIzNDcyNzUxMTk0MDUwDnZ0c19yZXF1ZXN0X2lkACUCHAAlvgEbB4gBcwQ1MTg0AmNkCjIwMjItMDctMTEDcmNiBzUxNDA0MDADYXBwBlZpZGVvcwJjdBlDT05UQUlORURfUE9TVF9BVFRBQ0hNRU5UE29yaWdpbmFsX2R1cmF0aW9uX3MHMTg5LjYzMgJ0cxRwcm9ncmVzc2l2ZV9vcmRlcmluZwA%3D&ccb=1-7&_nc_sid=894f7d&efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9zZCJ9&_nc_ohc=dagJibYx8LYAX8id7mA&_nc_ht=video-gru2-1.xx&oh=00_AT_8Zyfw6YEBRG2Vwk9EAgRUUs0H3Vo_yIRhW5YX4PUwLg&oe=62DB7D95&_nc_rid=214618993764275&dl=1'
        }
    ]
}
```

## Output Example - Failed
```
{
    success: false,
}
```

