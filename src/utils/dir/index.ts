import * as fs from 'fs';
import { FolderAlreadyCreatedException } from './exceptions/folder-already-create.exception';

export const createFolder = (dir: string) => {
  if (fs.existsSync(dir)) {
    throw new FolderAlreadyCreatedException();
  }

  fs.mkdirSync(dir);
};
