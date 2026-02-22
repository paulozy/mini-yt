import { CreateMultipartUploadCommand, PutObjectCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IStorageService, IStorageServiceInitiateMultipartUploadOutput, IStorageServicePresignInput } from "../../../domain/services/storage/storage.interface";
import { env } from "../../../shared/config/env";

export class S3StorageService implements IStorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: env.STORAGE.AWS_REGION,
      endpoint: env.STORAGE.S3_ENDPOINT,
      credentials: {
        accessKeyId: env.STORAGE.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.STORAGE.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true
    });
  }

  async presign(params: IStorageServicePresignInput): Promise<string> {
    const { id, filename, mimeType, resourceType, uploadId, part } = params;

    if (uploadId) {
      const command = new UploadPartCommand({
        Bucket: env.STORAGE.S3_BUCKET_NAME,
        Key: `${id}/video/${filename}`,
        PartNumber: part,
        UploadId: uploadId,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    }

    const command = new PutObjectCommand({
      Bucket: env.STORAGE.S3_BUCKET_NAME,
      Key: `${id}/${resourceType}/${filename}`,
      ContentType: mimeType,
    })

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return url;
  }

  async initiateMultipartUpload(params: IStorageServicePresignInput): Promise<IStorageServiceInitiateMultipartUploadOutput> {
    const { id, filename, mimeType, resourceType } = params;

    const command = new CreateMultipartUploadCommand({
      Bucket: env.STORAGE.S3_BUCKET_NAME,
      Key: `${id}/${resourceType}/${filename}`,
      ContentType: mimeType,
    });

    const { UploadId } = await this.s3Client.send(command);

    const url = await this.presign({
      id,
      filename,
      mimeType,
      resourceType,
      uploadId: UploadId,
    });

    return { uploadId: UploadId!, url };
  }
}