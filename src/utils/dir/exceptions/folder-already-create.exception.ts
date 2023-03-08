export class FolderAlreadyCreatedException extends Error {
  constructor() {
    super('The folder specified already created');
    this.name = 'FolderAlreadyCreatedException';
  }
}
