import { S3 } from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import * as getEnv from 'getenv'
import { v4 as uuidv4 } from 'uuid'

const AWS_ACCESS_KEY_ID = getEnv('AWS_ACCESS_KEY_ID')
const AWS_SECRET_ACCESS_KEY = getEnv('AWS_SECRET_ACCESS_KEY')
const AWS_HOST = getEnv('AWS_HOST', 'NO_HOST')
const AWS_PORT = getEnv.int('AWS_PORT')
const AWS_S3_AUDIOS_BUCKET = getEnv('AWS_S3_AUDIOS_BUCKET')
const AWS_S3_CONTRACTS_BUCKET = getEnv('AWS_S3_CONTRACTS_BUCKET')
const AWS_S3_PHOTOS_BUCKET = getEnv('AWS_S3_PHOTOS_BUCKET')
const AWS_LOGGING = getEnv.bool('AWS_LOGGING')

const s3: S3 = new S3({
  endpoint: AWS_HOST !== 'NO_HOST' ? `http://${AWS_HOST}:${AWS_PORT}` : null,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  logger: AWS_LOGGING ? console : null,
  s3ForcePathStyle: true,
  useAccelerateEndpoint: false,
})

export const uploadAudio = async (file: Express.Multer.File): Promise<string> => {
  return await uploadFile(file, AWS_S3_AUDIOS_BUCKET)
}

export const uploadContract = async (file: Express.Multer.File): Promise<string> => {
  return await uploadFile(file, AWS_S3_CONTRACTS_BUCKET)
}

export const uploadPhoto = async (file: Express.Multer.File): Promise<string> => {
  return await uploadFile(file, AWS_S3_PHOTOS_BUCKET)
}

const uploadFile = async (file: Express.Multer.File, Bucket: string): Promise<string> => {
  const id = uuidv4()
  const params: PutObjectRequest = {
    Bucket,
    Key: id,
    Body: file.buffer,
  }

  await s3.putObject(params).promise()
  return id
}