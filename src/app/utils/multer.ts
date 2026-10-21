import fs from 'fs';
import path from "path";
import os from "os";
import multer from 'multer';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

// ---------- Upload Directory (Safe for local and Vercel serverless /tmp) ----------
const UPLOAD_DIR = process.env.VERCEL
    ? path.join(os.tmpdir(), 'uploads')
    : path.join(process.cwd(), 'uploads');

// Ensure upload folder exists safely without crashing read-only serverless filesystems
try {
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
} catch (err) {
    console.warn("Upload directory initialization bypassed for serverless:", err);
}

// ---------- Multer disk storage ----------
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// Export multer upload
export const upload = multer({ storage });

// ---------- AWS S3 CLIENT ----------
const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy_key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy_secret',
    }
});

// ---------- Upload to AWS + Delete Local ----------
export const uploadToS3 = async (file: any) => {
    if (!file) throw new Error("No file provided");

    const filePath = file.path;
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME || 'saharan-image',
        Key: file.filename,
        Body: fileContent,
        ContentType: file.mimetype,
    };

    try {
        // Upload to S3
        await s3.send(new PutObjectCommand(params));

        // Delete local temporary file after successful upload
        fs.unlink(filePath, (err) => {
            if (err) console.error("Local file delete failed:", err);
        });

        return `https://${process.env.AWS_BUCKET_NAME || 'saharan-image'}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${file.filename}`;
    } catch (err) {
        console.error("S3 Upload failed:", err);
        throw err;
    }
};

// ---------- Local URL fallback ----------
export const getLocalImageURL = (filename: string) => {
    return `/uploads/${filename}`;
};
