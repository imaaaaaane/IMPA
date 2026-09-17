import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToR2 = async (file) => {
  if (!file) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const command = new PutObjectCommand({
    Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
    return fileName;
  } catch (error) {
    console.error("Error uploading file to R2:", error);
    throw error;
  }
};
