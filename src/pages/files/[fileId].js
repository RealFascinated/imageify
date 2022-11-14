import { Button } from "@nextui-org/react";
import Image from "next/image";
import { getFileInfo } from "src/utils/helpers/fileHelpers";

export default function File(props) {
	const { isValidFile, fileData } = props;
	const file = JSON.parse(fileData);
	let { uploader, fileId, uploadDate, contentType, fileUrl, width, height } =
		file;
	contentType = contentType.toLowerCase();

	if (isValidFile === false) {
		return "invalid file";
	}

	let toShow;
	if (contentType.includes("image")) {
		toShow = (
			<Image alt={fileId} src={fileUrl} width={width} height={height}></Image>
		);
	} else if (contentType.includes("video")) {
		toShow = <video alt={fileId} src={fileUrl} controls></video>;
	} else {
		<Button>Download</Button>;
	}

	return (
		<div className="h-screen flex items-center justify-center">{toShow}</div>
	);
}

export async function getServerSideProps(ctx) {
	let { fileId } = ctx.query;
	fileId = fileId.split(".")[0];

	const file = await getFileInfo(fileId);
	return {
		props: {
			isValidFile: file !== null,
			fileData: JSON.stringify(file || []),
		},
	};
}
