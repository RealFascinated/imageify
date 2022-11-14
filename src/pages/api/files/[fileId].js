import { getFileRaw } from "src/utils/helpers/fileHelpers";

/**
 * @param {NextRequest} req
 * @param {NextResponse} res
 */
export default async function handler(req, res) {
	const fileId = req.query.fileId;

	const { file, buffer } = await getFileRaw(fileId);

	res.setHeader("Content-Type", file.contentType);
	res.send(buffer);
}
