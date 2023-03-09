import { renderFile, Data } from 'template-file';
import * as fs from 'fs';
import { NoFileCreatedException } from '../../utils/cli/exceptions';

export const renderTemplate = async (
  dirTemplate: string,
  data: Data,
  dirApp: string,
  fileName: string,
) => {
  try {
    const renderedString = await renderFile(dirTemplate, data);

    fs.writeFile(
      `${dirApp}/${fileName}`,
      renderedString,
      function (resultCreateFile) {
        if (!resultCreateFile) {
          return;
        }
        throw new Error('Error during create a file on App');
      },
    );
  } catch (err) {
    throw new NoFileCreatedException();
  }
};
