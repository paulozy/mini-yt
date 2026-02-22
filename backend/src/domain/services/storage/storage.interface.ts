export type StorageResourceType = "video" | "thumb";

export type IStorageServicePresignInput = {
  id: string;
  filename: string;
  mimeType: string;
  resourceType: StorageResourceType;
  uploadId?: string; // Only for multipart uploads
  part?: number; // Only for multipart uploads
}

export type IStorageServiceInitiateMultipartUploadOutput = {
  uploadId: string;
  url: string;
}

export interface IStorageService {
  presign(input: IStorageServicePresignInput): Promise<string>;
  initiateMultipartUpload(
    input: IStorageServicePresignInput
  ): Promise<IStorageServiceInitiateMultipartUploadOutput>;
}