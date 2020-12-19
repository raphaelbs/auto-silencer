import { join } from 'path';
import { dir } from 'tmp';
import ffmpeg from 'fluent-ffmpeg';

function runOnTmpFolder(execution: (folder: string) => Promise<void>) {
  dir(async (err, path, cleanupCallback) => {
    if (err) throw err;
   
    await execution(path);
    
    cleanupCallback();
  });
}

async function getVideoDuration(videoPath): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);

      const stream = metadata.streams.find((stream) =>
        stream.codec_type === 'video'
      );
      const timeBase = stream.time_base.split('/');
      const fraction = Number(timeBase[0]) / Number(timeBase[1]);
      resolve(fraction * Number(stream.duration_ts));
    });
  });
}

function extracFrames(videoPath: string, folder: string) {
  ffmpeg(videoPath)
    .output(join(folder, 'frame-%08d.jpg'))
    .run();
}
 
export function run(filePath: string, environment = runOnTmpFolder) {
  environment(async (folder) => {
  
    const duration = await getVideoDuration(filePath);
    const durationMillis = duration * 1000;

    extracFrames(filePath, folder);
    
    console.log(folder, durationMillis);
  });
}