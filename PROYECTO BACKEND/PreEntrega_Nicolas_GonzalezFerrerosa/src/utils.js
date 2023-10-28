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