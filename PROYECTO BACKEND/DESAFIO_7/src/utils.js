import multer from 'multer';
import bcrypt from "bcrypt";


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
//////////////////hashing de las contraseñas
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);


export default __dirname;