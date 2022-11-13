import FileModel from "../../models/FileModel";
import UserModel from "../../models/UserModel";

export default function File(props) {
	const { isValidFile, fileData } = props;
	const file = JSON.parse(fileData);

	console.log(file);
}

export async function getServerSideProps(ctx) {
	let { fileId } = ctx.query;
	fileId = fileId.split(".")[0];

	const file = await FileModel.aggregate([
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
	console.log(file.uploader);
	return {
		props: {
			isValidFile: file !== null,
			fileData: JSON.stringify(file || []),
		},
	};
}
