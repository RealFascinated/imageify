import fs from "fs";
import NodeCache from "node-cache";
import path from "path";

const existsCache = new NodeCache({
	stdTTL: 300, // 5 minutes
});

/**
 * Checks if the given file/directory exists
 *
 * @param {string} path The path to the file/directory
 * @returns If the file/directory exists
 */
export function exists(path) {
	if (existsCache.has(path)) {
		return existsCache.get(path);
	}
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const exists = fs.existsSync(path);
	existsCache.set(path, exists);
	return exists;
}

/**
 * Creates a file in the given directory
 *
 * @param {string} path The path to the file
 * @param {Buffer} bytes The bytes of the file
 */
export function createFileIO(dir, fileName, bytes) {
	return new Promise(async (resolve, reject) => {
		if (!exists(dir)) {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			try {
				await fs.promises.mkdir(dir, { recursive: true }); // Create any missing directories
			} catch (err) {
				console.log(err);
				return reject(err);
			}
		}

		const fileLocation = dir + path.sep + fileName;
		try {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			await fs.promises.writeFile(fileLocation, bytes); // Write the file to disk
			resolve();
		} catch (err) {
			console.log(err);
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			await fs.promises.unlink(fileLocation); // Delete the file
			return reject(err);
		}
	});
}

/**
 * Creates a file in the given directory
 *
 * @param {string} path The path to the file
 * @return The file
 */
export function readFileIO(path) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	return fs.createReadStream(path);
}
