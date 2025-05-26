import { createReadStream } from "fs";
import fs from "fs";
import { google } from "googleapis";

const private_key = process.env.PRIVATE_KEY;
const client_email = process.env.CLIENT_MAIL;

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
  const jwtClient = new google.auth.JWT(client_email, null, private_key, SCOPE);
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFile(authClient, fileName, filePath) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileMetaData = {
      name: fileName,
      parents: ["1SRZAsPFGwNhvg9Uw1GtYRkjwr6u496Z1"],
    };
    const media = {
      mimeType: "application/pdf",
      body: createReadStream(filePath),
    };

    drive.files.create(
      {
        resource: fileMetaData,
        media: media,
        fields: "id, webViewLink, webContentLink",
      },
      function (error, file) {
        if (error) {
          return reject(error);
        }
        resolve(file.data);
      }
    );
  });
}

const drive = async (fileName, filePath) => {
  try {
    const authClient = await authorize();
    const fileData = await uploadFile(authClient, fileName, filePath);
    console.log("File uploaded successfully!", fileData);
    fs.unlinkSync(filePath);
    const driveUrl = fileData.webViewLink;
    return driveUrl;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
};

export default drive;
