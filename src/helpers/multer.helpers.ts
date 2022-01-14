import { diskStorage } from 'multer'

export const multerParams = {
  useFactory: () => ({
    storage: diskStorage({
      destination: './upload',
      filename: (req, file, cb) =>
        cb(null, `${Date.now()}-${file.originalname}`),
    }),
  }),
}
