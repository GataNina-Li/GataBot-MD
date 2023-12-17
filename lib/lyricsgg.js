import axios from "axios";
import cheerio from "cheerio";

class ErrorBuscarCancion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "[Error de busqueda]";
  }
}

async function BuscarLetra(cancion) {
  try {
    const URLdeBusqueda = `https://www.google.com/search?q=${encodeURIComponent(
      cancion + " song lyrics"
    )}`;
    const { data } = await axios.get(URLdeBusqueda, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const lineas = $('div[jsname="WbKHeb"] span')
      .map((i, el) => {
        return $(el).text();
      })
      .get();

    if (lineas.length > 0) {
      let artistag = $('div.rVusze span:contains("Artista") + span a').text();
      let albumg = $(
        'div[data-attrid="kc:/music/recording_cluster:first album"] a'
      ).text();
      let fechag = $(
        'div.rVusze span:contains("Fecha de lanzamiento") + span span'
      ).text();
      let generosg = $("div.rVusze span")
        .filter((i, el) => {
          return /Género|Géneros/.test($(el).text());
        })
        .next("span")
        .find("a")
        .map((i, el) => {
          return $(el).text();
        })
        .get();
      if (generosg.length === 0) {
        generosg = "No definido";
      }

      let plataformas = [];
      $(".PZPZlf.P8aK7e.Cdj8sf.tpa-ci").each(function () {
        const platformanombre = $(this).find(".i3LlFf").text();
        const platformaLink = $(this).find("a.JkUS4b.brKmxb").attr("href");

        plataformas.push({
          nombre: platformanombre,
          link: platformaLink,
        });
      });

      const otros = [];
      let contador = 0;
      $('div[data-md="277"] a').each(function () {
        if (contador < 3) {
          let titulog = $(this).find(".f3LoEf.OSrXXb").text();
          const artistagg = $(this).find(".XaIwc.ApHyTb.OSrXXb.C5w57c").text();
          titulog = titulog.replace("Letras de ", "");
          otros.push({
            titulo: titulog,
            artista: artistagg,
          });
          contador++;
        }
      });
      const lyria = [lineas.join("\n")];

      const CancionData = {
        titulo: cancion,
        artista: artistag,
        albulm: albumg,
        fecha: fechag,
        Generos: generosg,
        Escuchar: plataformas,
        otros,
        letra: lyria,
      };
      return CancionData;
    } else {
      throw new ErrorBuscarCancion(`No se encontro la cancion ${cancion}`);
    }
  } catch (error) {
    throw error;
  }
}
export default BuscarLetra;
