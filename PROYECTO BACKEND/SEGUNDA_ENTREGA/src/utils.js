import multer from 'multer';

const storage = multer.diskStorage({
    destination: './public/img' // Carpeta donde se guardarán los archivos
      ,
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const filename = file.originalname;
        cb(null, filename);
    }
});

export const uploader = multer({ storage });

import {fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;