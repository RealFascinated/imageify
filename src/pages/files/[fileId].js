import { Button } from "@nextui-org/react";
import moment from "moment/moment";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { getFileInfo } from "src/utils/helpers/fileHelpers";
import { formatBytes } from "src/utils/helpers/stringHelpers";
import { downloadURI } from "src/utils/helpers/webUtils";

export default function File(props) {
	const { isValidFile, fileData } = props;
	const file = JSON.parse(fileData);
	let {
		uploader,
		fileId,
		originalFileName,
		uploadDate,
		contentType,
		fileUrl,
		width,
		height,
		ext,
		size,
	} = file;

	const metaData = <NextSeo title={`${fileId}.${ext}`} />;

	let toShow;
	if (!isValidFile) {
		return (
			<>
				{metaData}
				<div className="h-screen flex items-center justify-center">
					<div className="flex flex-col text-center items-center justify-center">
						<h1 className="text-red-500 text-3xl mb-5">Invalid File</h1>
						<Link href="/">
							<Button auto className="bg-blue-600">
								Go Home
							</Button>
						</Link>
					</div>
				</div>
			</>
		);
	}
	if (isValidFile) {
		contentType = contentType.toLowerCase();
		if (contentType.includes("image")) {
			toShow = (
				<Image
					alt={fileId}
					src={fileUrl}
					width={width}
					height={height}
					unoptimized
				></Image>
			);
		}
		if (contentType.includes("video")) {
			toShow = <video alt={fileId} src={fileUrl} controls></video>;
		}
	}

	return (
		<>
			{metaData}
			<div className="h-screen flex items-center justify-center">
				<div className="flex flex-col items-center justify-center">
					<h1 className="font-bold text-lg">
						{originalFileName} ({fileId}.{ext})
					</h1>
					<h3>{moment(uploadDate).format("MMMM Do YYYY, h:mm:ss a")}</h3>
					<h3>
						Uploader: <span className="font-bold">{uploader.username}</span> -{" "}
						{formatBytes(size)}
					</h3>
					<div className="md:max-w-[70%] sm:w-fit sm:h-fit mt-3 items-center justify-center">
						{toShow}
					</div>
					{!toShow ? (
						<Button
							auto
							className="bg-blue-600 mt-5"
							onPress={() => {
								downloadURI(fileUrl, `${fileId}.${ext}`);
							}}
						>
							Download
						</Button>
					) : null}
				</div>
			</div>
		</>
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
