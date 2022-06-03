import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export default function deleteFiles(dir: string): void {
  fs.readdir(dir, (err: any, files: any) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(dir, file), (err: any) => {
        if (err) throw err;
      });
    }
    logger.info(`Deleted files successfully from ===> ${dir}`);
  });
}
