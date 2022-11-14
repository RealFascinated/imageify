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
	if (!exists(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const fileLocation = dir + path.sep + fileName;
	fs.writeFile(
		fileLocation,
		bytes,
		{
			encoding: "utf-8",
		},
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);
}

/**
 * Creates a file in the given directory
 *
 * @param {string} path The path to the file
 * @return The file
 */
export function readFileIO(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				return reject(err);
			}
			return resolve(data);
		});
	});
}
