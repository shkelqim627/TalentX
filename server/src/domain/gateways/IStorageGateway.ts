export interface IStorageGateway {
    uploadFile(file: Express.Multer.File, folderId?: string): Promise<string>;
}
