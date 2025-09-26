import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN!

export interface UploadResult {
  key: string
  url: string
  cloudfrontUrl: string
}

export class S3Service {
  /**
   * Generate a presigned URL for uploading audio files
   */
  static async getUploadUrl(
    key: string,
    contentType: string = 'audio/mpeg',
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  }

  /**
   * Generate a presigned URL for downloading/streaming audio files
   */
  static async getStreamUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  }

  /**
   * Get CloudFront URL for public access
   */
  static getCloudFrontUrl(key: string): string {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`
  }

  /**
   * Upload file to S3
   */
  static async uploadFile(
    file: File,
    key: string,
    contentType?: string
  ): Promise<UploadResult> {
    const uploadUrl = await this.getUploadUrl(key, contentType)
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType || file.type,
      },
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return {
      key,
      url: uploadUrl,
      cloudfrontUrl: this.getCloudFrontUrl(key),
    }
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(key: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  }

  /**
   * Generate unique key for audio files
   */
  static generateAudioKey(
    userId: string,
    filename: string,
    timestamp?: number
  ): string {
    const timestampStr = timestamp || Date.now()
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `audio/${userId}/${timestampStr}_${sanitizedFilename}`
  }

  /**
   * Generate unique key for thumbnails
   */
  static generateThumbnailKey(
    userId: string,
    filename: string,
    timestamp?: number
  ): string {
    const timestampStr = timestamp || Date.now()
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `thumbnails/${userId}/${timestampStr}_${sanitizedFilename}`
  }
}

export { s3Client }
