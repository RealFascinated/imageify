import { formatBytes } from "./stringHelpers";

/**
 * Formats the given string with the placeholders for the image
 *
 * @param {{}} file The file to replace the placeholders for
 * @param {string} string The message to replace the placeholders for
 * @returns The formatted string
 */
export function replaceFilePlaceholders(file, string) {
	const { fileId, originalFileName, contentType, ext, size } = file;

	return string
		.replace("{id}", fileId)
		.replace("{original-name}", originalFileName)
		.replace("{content-type}", contentType)
		.replace("{ext}", ext)
		.replace("{size}", formatBytes(size));
}
