import { Readable, Stream, Writable } from "stream";
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

export function reduceBitrate(inputStream: Stream) {
    return new Promise((resolve, reject) => {
        const outputChunks = [];
        ffmpeg(inputStream)
            .audioBitrate(64) // low quality. You can update that
            .on("error", reject)
            .on("end", () => resolve(Buffer.concat(outputChunks)))
            .format("mp3")
            .pipe(
                new Writable({
                    write(chunk, encoding, callback) {
                        outputChunks.push(chunk);
                        callback();
                    },
                })
            );
    });
}

export function bufferToReadableStream(buffer: any, filename: string) {
    const readable = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        },
    });
    //@ts-ignore
    readable.path = filename;
    return readable;
}

export function arrayBufferToStream(buffer: Buffer) {
    const readable = new Readable({
        read() {
            this.push(Buffer.from(buffer));
            this.push(null);
        },
    });
    return readable;
}