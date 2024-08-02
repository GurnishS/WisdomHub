import { google } from "googleapis";

const client_email = process.env.GOOGLE_CLIENT_EMAIL;
const private_key = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
const SCOPE = ["https://www.googleapis.com/auth/drive"];

/**
 * A function that can provide access to the Google Drive API.
 * @returns {Promise<google.auth.JWT>}
 */
async function authorize() {
  const jwtClient = new google.auth.JWT(client_email, null, private_key, SCOPE);
  await jwtClient.authorize();
  return jwtClient;
}

/**
 * Upload a PDF file to Google Drive.
 * @param {Buffer} fileBuffer - The file buffer.
 * @param {string} originalFileName - The original file name.
 * @returns {Promise<Object>}
 */
async function uploadToGoogleDrive(fileBuffer, originalFileName) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authorize() });
    const fileMetaData = {
      name: originalFileName,
      parents: ["1SRZAsPFGwNhvg9Uw1GtYRkjwr6u496Z1"], // Folder ID
    };

    drive.files.create(
      {
        resource: fileMetaData,
        media: {
          body: fileBuffer,
          mimeType: "application/pdf",
        },
        fields: "id",
      },
      (error, file) => {
        if (error) {
          return reject(error);
        }
        resolve(file);
      }
    );
  });
}

export { uploadToGoogleDrive };
