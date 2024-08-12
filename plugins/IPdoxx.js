import axios from 'axios';

let handler = async (m, { conn, text }) => {
  await m.reply("Buscando...");
  if (!text) return conn.reply(m.chat, "Ingrese una dirección IP válida", m);

  try {
    let res = await axios.get(`http://ip-api.com/json/${text}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,hosting,query`);
    const data = res.data;

    if (data.status !== "success") {
      return conn.reply(m.chat, data.message || "Falló", m);
    }

    let ipsearch = ` 
    𝐈𝐏 𝐈𝐍𝐅𝐎

    IP : ${data.query}
    País : ${data.country}
    Código de País : ${data.countryCode}
    Provincia : ${data.regionName}
    Código de Provincia : ${data.region}
    Ciudad : ${data.city}
    Distrito : ${data.district}
    Código Postal : ${data.zip}
    Coordenadas : ${data.lat}, ${data.lon}
    Zona Horaria : ${data.timezone}
    ISP : ${data.isp}
    Organización : ${data.org}
    AS : ${data.as}
    Mobile : ${data.mobile ? "Si" : "No"}
    Hosting : ${data.hosting ? "Si" : "No"}
    `.trim();

    await conn.reply(m.chat, ipsearch, m);
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, 'Ocurrió un error al obtener la información de la IP.', m);
  }
}

handler.tags = ['tools'];
handler.command = /^(ip|ipcheck|ipcek)$/i;
handler.owner = true;

export default handler;
