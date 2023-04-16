//List all the functions
declare class NekoClient {
  sfw: {
    tickle():Promise<NekoClient.NekoRequestResults>;
    slap():Promise<NekoClient.NekoRequestResults>;
    smug():Promise<NekoClient.NekoRequestResults>;
    baka():Promise<NekoClient.NekoRequestResults>;
    poke():Promise<NekoClient.NekoRequestResults>;
    pat():Promise<NekoClient.NekoRequestResults>;
    neko():Promise<NekoClient.NekoRequestResults>;
    nekoGif():Promise<NekoClient.NekoRequestResults>;
    meow():Promise<NekoClient.NekoRequestResults>;
    lizard():Promise<NekoClient.NekoRequestResults>;
    kiss():Promise<NekoClient.NekoRequestResults>;
    hug():Promise<NekoClient.NekoRequestResults>;
    foxGirl():Promise<NekoClient.NekoRequestResults>;
    feed():Promise<NekoClient.NekoRequestResults>;
    cuddle():Promise<NekoClient.NekoRequestResults>;
    woof():Promise<NekoClient.NekoRequestResults>;
    why():Promise<NekoClient.NekoWhyResult>;
    catText():Promise<NekoClient.NekoCatResult>;
    OwOify(opts: NekoClient.NekoQueryParams):Promise<NekoClient.NekoOwOResult>;
    eightBall(opts: NekoClient.NekoQueryParams):Promise<NekoClient.NekoChatResults>;
    fact():Promise<NekoClient.NekoFactResult>;
    kemonomimi():Promise<NekoClient.NekoRequestResults>;
    holo():Promise<NekoClient.NekoRequestResults>;
    spoiler(opts: NekoClient.NekoQueryParams):Promise<NekoClient.NekoOwOResult>;
    avatar():Promise<NekoClient.NekoRequestResults>;
    waifu():Promise<NekoClient.NekoRequestResults>;
    gecg():Promise<NekoClient.NekoRequestResults>;
    goose():Promise<NekoClient.NekoRequestResults>;
    wallpaper():Promise<NekoClient.NekoRequestResults>;
  }
  nsfw: {
    randomHentaiGif():Promise<NekoClient.NekoRequestResults>;
    pussy():Promise<NekoClient.NekoRequestResults>;
    nekoGif():Promise<NekoClient.NekoRequestResults>;
    neko():Promise<NekoClient.NekoRequestResults>;
    lesbian():Promise<NekoClient.NekoRequestResults>;
    kuni():Promise<NekoClient.NekoRequestResults>;
    cumsluts():Promise<NekoClient.NekoRequestResults>;
    classic():Promise<NekoClient.NekoRequestResults>;
    boobs():Promise<NekoClient.NekoRequestResults>;
    bJ():Promise<NekoClient.NekoRequestResults>;
    anal():Promise<NekoClient.NekoRequestResults>;
    avatar():Promise<NekoClient.NekoRequestResults>;
    yuri():Promise<NekoClient.NekoRequestResults>;
    trap():Promise<NekoClient.NekoRequestResults>;
    tits():Promise<NekoClient.NekoRequestResults>;
    girlSoloGif():Promise<NekoClient.NekoRequestResults>;
    girlSolo():Promise<NekoClient.NekoRequestResults>;
    pussyWankGif():Promise<NekoClient.NekoRequestResults>;
    pussyArt():Promise<NekoClient.NekoRequestResults>;
    kemonomimi():Promise<NekoClient.NekoRequestResults>;
    kitsune():Promise<NekoClient.NekoRequestResults>;
    keta():Promise<NekoClient.NekoRequestResults>;
    holo():Promise<NekoClient.NekoRequestResults>;
    holoEro():Promise<NekoClient.NekoRequestResults>;
    hentai():Promise<NekoClient.NekoRequestResults>;
    futanari():Promise<NekoClient.NekoRequestResults>;
    femdom():Promise<NekoClient.NekoRequestResults>;
    feetGif():Promise<NekoClient.NekoRequestResults>;
    eroFeet():Promise<NekoClient.NekoRequestResults>;
    feet():Promise<NekoClient.NekoRequestResults>;
    ero():Promise<NekoClient.NekoRequestResults>;
    eroKitsune():Promise<NekoClient.NekoRequestResults>;
    eroKemonomimi():Promise<NekoClient.NekoRequestResults>;
    eroNeko():Promise<NekoClient.NekoRequestResults>;
    eroYuri():Promise<NekoClient.NekoRequestResults>;
    cumArts():Promise<NekoClient.NekoRequestResults>;
    blowJob():Promise<NekoClient.NekoRequestResults>;
    spank():Promise<NekoClient.NekoRequestResults>;
    gasm():Promise<NekoClient.NekoRequestResults>;
  }
}

export = NekoClient;


declare namespace NekoClient {
  //Help create options interface for the few functions that need it
  export interface NekoQueryParams {
    text: string;
  }
  export interface NekoRequestResults {
    url: string;
  }
  export interface NekoChatResults {
    response: string;
    url?: string;
  }
  export interface NekoCatResult {
    cat: string;
  }
  export interface NekoWhyResult {
    why: string;
  }
  export interface NekoOwOResult {
    owo: string;
  }
  export interface NekoFactResult {
    fact: string; 
  }
}
