import { create } from 'ipfs-http-client'
import * as getEnv from 'getenv'

const IPFS_HOST = getEnv('IPFS_HOST')
const IPFS_PORT = getEnv.int('IPFS_PORT')
const IPFS_PROTOCOL = getEnv('IPFS_PROTOCOL')

const client = create({ host: IPFS_HOST, port: IPFS_PORT, protocol: IPFS_PROTOCOL })

export const uploadAudio = async (file: Express.Multer.File): Promise<string> => {
  return await uploadFile(file)
}

export const uploadContract = async (file: Express.Multer.File): Promise<string> => {
  return await uploadFile(file)
}

const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  const result = await client.add(file.buffer, { pin: true })
  return result.cid.toString()
}