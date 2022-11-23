import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { getFileInfo } from "src/utils/helpers/fileHelpers";
import { replaceFilePlaceholders } from "src/utils/helpers/placeholderHelpers";
import { formatBytes } from "src/utils/helpers/stringHelpers";
import { downloadURI } from "src/utils/helpers/webUtils";

const Link = dynamic(() => import("next/link"));
const Image = dynamic(() => import("next/image"));
const Button = dynamic(() => import("@nextui-org/react/button"));
const Text = dynamic(() => import("@nextui-org/react/text"));

export default function File({ isValidFile, fileData }) {
	const file = JSON.parse(fileData);
	let {
		uploader,
		fileId,
		originalFileName,
		uploadDate,
		fileUrl,
		width,
		height,
		ext,
		size,
		isImage,
		isVideo,
	} = file;

	let imageOrVideo;
	if (isValidFile) {
		if (isImage) {
			imageOrVideo = {
				images: [
					{
						url: fileUrl,
						height: height,
						width: width,
					},
				],
			};
		}
		if (isVideo) {
			imageOrVideo = {
				videos: [
					{
						url: fileUrl,
						height: height,
						width: width,
					},
				],
			};
		}
	}

	let openGraph = {};
	let embedColor;
	if (isValidFile) {
		if (!isVideo && !isImage) {
			openGraph.description = "Click to open and download this file";
		}
		if (imageOrVideo) {
			openGraph = Object.assign(openGraph, imageOrVideo);
		}

		const { embed, title, description, color } = uploader.discordEmbed;
		if (!embed) {
			openGraph.title = undefined;
			openGraph.description = undefined;
		} else {
			openGraph.title = replaceFilePlaceholders(file, title);
			openGraph.description = replaceFilePlaceholders(file, description || "");
			embedColor = "#" + color;
		}
	}
	if (!isValidFile) {
		openGraph.title = "Unknown file";
		openGraph.description = "This file was not found, is this correct id?";
	}
	const metaData = (
		<NextSeo
			// Find a fix for the title also being added to the
			// open graph tags so we can re-enable this
			// it breaks disabing embeds on discord (user setting)
			// title={isValidFile ? `${fileId}.${ext}` : "Unknown file"}
			openGraph={openGraph}
			themeColor={embedColor ? embedColor : undefined}
			twitter={{
				cardType: isImage ? "summary_large_image" : isVideo ? "player" : null,
			}}
			noindex
		/>
	);

	let toShow;
	if (!isValidFile) {
		return (
			<>
				{metaData}
				<div className="h-[89.9vh] flex items-center justify-center">
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
		if (isImage) {
			toShow = (
				<Image alt={fileId} src={fileUrl} width={width} height={height}></Image>
			);
		}
		if (isVideo) {
			toShow = <video alt={fileId} src={fileUrl} controls></video>;
		}
	}

	return (
		<>
			{metaData}
			<div className="h-[89.9vh] flex items-center justify-center">
				<div className="flex flex-col items-center justify-center">
					<Text h1 className="font-bold text-lg">
						{originalFileName} ({fileId}.{ext})
					</Text>
					<Text>{uploadDate}</Text>
					<Text>
						Uploader: <span className="font-bold">{uploader.username}</span> -{" "}
						{formatBytes(size)}
					</Text>
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

export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
	let { fileId } = params;
	fileId = fileId.split(".")[0];

	const file = await getFileInfo(fileId);
	return {
		props: {
			isValidFile: file !== null,
			fileData: JSON.stringify(file || []),
		},
		revalidate: 60, // 1 minute
	};
}
