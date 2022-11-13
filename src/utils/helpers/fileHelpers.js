import path from "path";
import { FILE_STORAGE_LOCATION } from "../../consts/filePaths";
import FileModel from "../../models/FileModel";
import { createFileIO } from "./ioHelpers";
import { connectMongo } from "./mongoHelpers";
import { randomString } from "./stringHelpers";

connectMongo();

/**
 * Returns the the files object in mongo for the given id
 *
 * @param {string} fileId The files id
 * @return The file object or null if not found
 */
export async function getFile(fileId) {
	return await FileModel.findOne({ fileId: fileId });
}

/**
 * Creates the file object in mongo and stores it to the storage location
 *
 * @param {UserModel} uploader The user who uploaded the file
 * @param {[]} fileData The file data for the upload
 */
export async function createFile(uploader, fileName, buffer, contentType) {
	const fileId = randomString(process.env.FILE_ID_LENGTH);
	const extention = fileName.split(".")[1].toLowerCase();
	// Todo: Check if the file was actually saved to
	// disk and create a return type so we can notify the user what happened
	await createFileIO(
		`${FILE_STORAGE_LOCATION}${path.sep}${uploader.uploadKey}`,
		`${fileId}.${extention}`,
		buffer
	);
	const file = await FileModel.create({
		uploader: uploader._id,
		fileId: fileId,
		uploadDate: new Date(),
		contentType: contentType,
	});
	await file.save();
	return `${fileId}.${extention}`;
}
