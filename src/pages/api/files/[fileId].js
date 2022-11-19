import { StatusCodes } from "http-status-codes";
import { getFileRaw } from "src/utils/helpers/fileHelpers";

/**
 * @param {NextRequest} req
 * @param {NextResponse} res
 */
export default async function handler(req, res) {
	const fileId = req.query.fileId.split(".")[0]; // The file id to fetch

	const { file, readStream } = await getFileRaw(fileId); // Fetch the info and readStream for the file
	if (file == null) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: StatusCodes.NOT_FOUND, message: "File not found" });
	}

	res.setHeader("Content-Type", file.contentType); // Set the content type header
	res.setHeader("Cache-control", "public, max-age=3600"); // Cache the file for 1 hour
	readStream.pipe(res); // Send the file to the client
}

export const config = {
	api: {
		responseLimit: "1gb", // Limit the response size (the file data)
	},
};
