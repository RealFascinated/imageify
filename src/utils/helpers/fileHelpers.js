import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
import path from "path";
import UserModel from "src/models/UserModel";
import { FILE_STORAGE_LOCATION } from "../../consts/filePaths";
import FileModel from "../../models/FileModel";
import { createFileIO, readFileIO } from "./ioHelpers";
import { connectMongo } from "./mongoHelpers";
import { randomString } from "./stringHelpers";

connectMongo();

const BASE_STORAGE = `${FILE_STORAGE_LOCATION}${path.sep}`;

/**
 * Returns the the files object in mongo for the given id
 *
 * @param {string} fileId The files id
 * @param {boolean} isInternal If true, will return more data
 * @return The file object or null if not found
 */
export async function getFileInfo(fileId, isInternal = false) {
	// Todo: Implement cache?
	let file = await FileModel.aggregate([
		{
			$match: {
				fileId: fileId,
			},
		},
		{
			$lookup: {
				from: UserModel.collection.name,
				localField: "uploader",
				foreignField: "_id",
				as: "uploader",
			},
		},
	]).exec();
	if (file.length < 1) {
		return null;
	}
	file = file[0];
	const uploader = file.uploader[0];
	uploader._id = undefined;
	if (!isInternal) {
		uploader.uploadKey = undefined;
	}
	uploader.password = undefined;
	uploader.salt = undefined;
	uploader.lastLoginDate = undefined;
	uploader.__v = undefined;
	file.uploader = uploader;
	file._id = undefined;
	file.__v = undefined;
	file.fileUrl =
		process.env.NEXT_PUBLIC_SITE_URL +
		"/api/files/" +
		file.fileId +
		"." +
		file.ext;
	return file;
}

/**
 * Creates the file object in mongo and stores it to the storage location
 *
 * @param {UserModel} uploader The user who uploaded the file
 * @param {string} fileName The original files name
 * @param {Buffer} buffer The buffer of the file
 * @param {string} contentType The content type of the file
 * @param {Number} size The size of the file
 * @return The file id or undefined if there was an error
 */
export async function createFile(
	uploader,
	fileName,
	buffer,
	contentType,
	size
) {
	const fileId = randomString(process.env.FILE_ID_LENGTH);
	const extention = fileName.split(".").at(-1).toLowerCase();
	return new Promise((resolve, reject) => {
		createFileIO(
			`${BASE_STORAGE}${uploader.uploadKey}`,
			`${fileId}.${extention}`,
			buffer
		)
			.then(async () => {
				const file = await FileModel.create({
					uploader: uploader._id,
					fileId: fileId,
					originalFileName: fileName,
					uploadDate: new Date(),
					contentType: contentType,
					ext: extention,
					size: size,
				});

				contentType = contentType.toLowerCase();
				if (contentType.includes("image") || contentType.includes("video")) {
					const fileMetaData = await ffprobe(
						`${BASE_STORAGE}${uploader.uploadKey}${path.sep}${fileId}.${extention}`,
						{ path: ffprobeStatic.path }
					);
					const dimensions = fileMetaData.streams[0];
					file.width = dimensions.width;
					file.height = dimensions.height;
				}

				await file.save();
				resolve(`${fileId}.${extention}`);
			})
			.catch((err) => {
				reject();
			});
	});
}

/**
 * Gets the files info and the files buffer
 *
 * @param {string} fileId The id of the file
 * @returns The file info and file buffer
 */
export async function getFileRaw(fileId) {
	const fileInfo = await getFileInfo(fileId, true);
	if (fileInfo == null) {
		return { file: null, readStream: null };
	}

	const filePath = `${BASE_STORAGE}${fileInfo.uploader.uploadKey}${path.sep}${fileInfo.fileId}.${fileInfo.ext}`;
	const readStream = readFileIO(filePath);
	return { file: fileInfo, readStream: readStream };
}
