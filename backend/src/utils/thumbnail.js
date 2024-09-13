import { resolve, join, parse } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const __dirname = resolve();
const publicFolderPath = join(__dirname);

async function convertPdfPageToImage(fileName) {
  try {
    const pdfPath = join(publicFolderPath, fileName);
    const outputFilePath = join(
      publicFolderPath,
      "public",
      "temp",
      `${parse(fileName).name}.jpg`
    );

    console.log(`PDF Path: ${pdfPath}`);
    console.log(`Output File Path: ${outputFilePath}`);
    const command = `pdftoppm -jpeg -f 1 -l 1 -singlefile "${pdfPath}" "${outputFilePath.slice(
      0,
      -4
    )}"`;
    await execPromise(command);
    console.log("PDF page converted to JPEG successfully.");

    return outputFilePath;
  } catch (error) {
    console.error("Error converting PDF to JPEG:", error);
  }
}

export default convertPdfPageToImage;
