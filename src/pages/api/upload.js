import { StatusCodes } from "http-status-codes";
import multer from "multer";
import nextConnect from "next-connect";
import { createFile } from "../../utils/helpers/fileHelpers";
import { getUserByUploadKey } from "../../utils/helpers/userHelpers";

const apiRoute = nextConnect({
	onError(error, req, res) {
		res.status(StatusCodes.OK).json({
			message: "An internal server error has occured. Please check console.",
		});
		console.log(error);
	},
	onNoMatch(req, res) {
		res
			.status(StatusCodes.OK)
			.json({ message: `Method ${req.method} not allowed` });
	},
});

apiRoute.use(
	multer({
		limits: {
			fileSize: process.env.MAX_FILE_SIZE,
		},
	}).single("file")
);

apiRoute.post(async (req, res) => {
	const file = req.file;
	if (!file) {
		return res.status(StatusCodes.OK).json({
			status: "OK",
			message: "No file provided",
		});
	}
	const { originalname: filename, mimetype, buffer, size } = file;
	const { secret } = req.body;

	const user = await getUserByUploadKey(secret);
	if (user == null) {
		return res.status(StatusCodes.OK).json({
			status: "OK",
			message: "Unauthorized",
		});
	}

	createFile(user, filename, buffer, mimetype, size)
		.then((id) => {
			res.status(StatusCodes.OK).json({
				message: `${process.env.NEXT_PUBLIC_SITE_URL}/files/${id}`,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(StatusCodes.OK).json({
				status: "OK",
				message: "There was an error saving this file",
			});
		});
});

export default apiRoute;

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};
