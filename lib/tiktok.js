import axios from 'axios';
import cheerio from 'cheerio';

const clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");
};

async function shortener(url) {
  return url;
}

export const Tiktok = async (query) => {
  let response = await axios("https://lovetik.com/api/ajax/search", {
    method: "POST",
    data: new URLSearchParams(Object.entries({ query })),
  });

  const result = {}; 

  result.creator = "YNTKTS";
  result.title = clean(response.data.desc);
  result.author = clean(response.data.author);
  result.nowm = await shortener(
    (response.data.links[0].a || "").replace("https", "http")
  );
  result.watermark = await shortener(
    (response.data.links[1].a || "").replace("https", "http")
  );
  result.audio = await shortener(
    (response.data.links[2].a || "").replace("https", "http")
  );
  result.thumbnail = await shortener(response.data.cover);
  return result;
}

async function ttimg(link) {
  try {
    let url = `https://dlpanda.com/es?url=${link}&token=G7eRpMaa`;
    let response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let imgSrc = [];
    $('div.col-md-12 > img').each((index, element) => {
      imgSrc.push($(element).attr('src'));
    });
    if (imgSrc.length === 0) {
      return { data: '*[❗] No se encontraron imágenes en el enlace proporcionado.*' };
    }
    return { data: imgSrc };
  } catch (error) {
    console.log(error); 
    return { data: '*[❗] No se obtuvo respuesta de la página, intente más tarde.*' };
  }
}

export { ttimg };