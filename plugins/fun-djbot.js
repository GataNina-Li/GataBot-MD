/**
[ By @NeKosmic || https://github.com/NeKosmic/ ]
**/
import{toAudio as e}from"../lib/converter.js";import*as a from"fs";let handler=async(e,{conn:a,usedPrefix:t,command:r,text:i})=>{let l=await a.getName(e.sender),o=e.reply(gt.Proces(l));await o;try{let m=await fetchJson(`https://latam-api.vercel.app/api/rand_audio?apikey=${MyApiKey}`);a.sendMessage(e.chat,{audio:{url:m.audio},contextInfo:{externalAdReply:{title:`${l} 🎧`,mediaType:2,thumbnailUrl:"https://github.com/GataNina-Li/GataBot-MD/raw/main/media/menus/Menu1.jpg",previewType:"VIDEO",mediaUrl:"https://youtu.be/Tk9Pitk1_oM"}},fileName:"DjNK.mp3",mimetype:"audio/mpeg",ptt:!0},{quoted:e})}catch(p){e.reply(gt.Error0())}};handler.help=["djbot"],handler.tags=["random"],handler.command=/^(djbot)$/i;export default handler;

