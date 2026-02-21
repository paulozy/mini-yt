export interface IStorageService {
  presign(id: string, filename: string, mimeType: string): Promise<{ url: string; fields: Record<string, any> }>;
}