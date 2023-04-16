import {Initializer} from "multi-integer-range";

declare module "@nsfw-filter/gif-frames" {

    export default function gifFrames<T extends GifFrameOptions>(options: T): Promise<GifFrameData<T>[]>;
    export default function gifFrames<T extends GifFrameOptions>(options: T, callback: (err: Error, frameData: GifFrameData<T>[]) => void): void;

    type GifOutputType = "jpeg" | "jpg" | "gif" | "png" | "canvas";
    type GifFrameData<T extends GifFrameOptions> = T["outputType"] extends "canvas" ? GifFrameCanvas : GifFrameReadableStream;

    interface GifFrameOptions {
        url: string | ArrayBuffer;
        frames: "all" | Initializer;
        outputType?: GifOutputType;
        quality?: number;
        cumulative?: boolean;
    }

    interface GifFrameCanvas {
        getImage(): HTMLCanvasElement;
        frameIndex: number;
        frameInfo: GifFrameInfo;
    }

    interface GifFrameBuffer {
        getImage(): ImageData;
        frameIndex: number;
        frameInfo: GifFrameInfo;
    }

    interface GifFrameInfo {
        x: number;
        y: number;
        width: number;
        height: number;
        has_local_palette: boolean;
        palette_offset: number;
        palette_size: number;
        data_offset: number;
        data_length: number;
        transparent_index: number;
        interlaced: boolean;
        delay: number;
        disposal: number;
    }
}
