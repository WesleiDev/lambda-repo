export class NoFileCreatedException extends Error {
  constructor() {
    super('Error to create a file template on App');
    this.name = 'NoFileCreatedException';
  }
}
