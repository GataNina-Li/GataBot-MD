# Here is available language you can use in this library

- Indonesia ~ If your hosting location or application location is in Indonesia, you can enter code `id`
- United States ~ If your hosting location or application location is in America or United States (US), you can enter code `us`
- Spain ~ If your hosting location or application location is in Spain, you can enter code `es`.
- Portuguese ~ If your hosting location or application location is in Portuguese, you can enter code `pt`.
- Russia ~ If your hosting location or application location is in Russia, you can enter code `ru`.
- Roman/Romania ~ If your hosting location or application location is in Roman, you can enter code `ro`.
- Turkey ~ If your hosting location or application location is in Turkey, you can enter code `tr`.
- Philipines (the) ~ If your hosting location or application location is in Philipine, you can enter code `ph`.
- Poland ~ If your hosting location or application location is in Poland, you can enter code `pl`.
- India ~ If your hosting location or application location is in India, you can enter code `hi`.
- France ~ If your hosting location or application location is in France, you can enter code `fr`

# Example code
```js
const Brainly = require("brainly-scraper-v2");
const brain = new Brainly("id"); // 'id' - Can be replaced with the country code above. Default to 'id'

brain.search("id", "Pythagoras").then(console.log).catch(console.error);
```