/**
 * Downloads a file to the users browser
 *
 * @param {string} uri The url to the file
 * @param {string} name The name of the file to be saved
 */
export function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
