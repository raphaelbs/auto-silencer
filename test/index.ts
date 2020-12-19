import { join } from 'path';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';

import { run } from '../src';

const filePath = join(__dirname, 'video.mp4');

function runOnTestFolder(execution: (folder: string) => Promise<void>) {
  const testDir = join(__dirname, 'tmp');

  rimraf.sync(testDir);
  mkdirp.sync(testDir);
  
  execution(testDir);
}

run(filePath, runOnTestFolder);
