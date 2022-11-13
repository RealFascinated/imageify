import multer from "multer";
import nextConnect from "next-connect";
import { createFile } from "../../../utils/helpers/fileHelpers";
import { getUserByUploadKey } from "../../../utils/helpers/userHelpers";

const apiRoute = nextConnect({
	onError(error, req, res) {
		res.status(501).json({
			message: `An internal server error has occured. Please check console.`,
		});
		console.log(error);
	},
	onNoMatch(req, res) {
		res.status(405).json({ message: `Method "${req.method}" Not Allowed` });
	},
});

apiRoute.use(multer().any());

apiRoute.post(async (req, res) => {
	const file = req.files[0];
	if (!file) {
		return res.status(200).json({
			status: "OK",
			message: `No file provided`,
		});
	}
	const { originalname: filename, mimetype, buffer, size } = file;
	const { secret } = req.body;
	console.log(secret);

	const user = await getUserByUploadKey(secret);
	if (user == null) {
		return res.status(200).json({
			status: "OK",
			message: `Unauthorized`,
		});
	}

	const id = await createFile(user, filename, buffer, mimetype);
	res.status(200).json({
		message: `${process.env.NEXT_PUBLIC_SITE_URL}/files/${id}`,
	});
});

export default apiRoute;

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};
