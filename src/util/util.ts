import fs from "fs";
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export const filterImageFromURL = (inputURL: string): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const photo = await Jimp.read(inputURL);
			const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
			await photo
				.resize(256, 256) // resize
				.quality(60) // set JPEG quality
				.greyscale() // set greyscale
				.write(__dirname + outpath, (img) => {
					resolve(__dirname + outpath);
				});
		} catch (error) {
			reject("Error from Jimp - " + error);
		}
	});
};

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
export const deleteLocalFiles = (except: string) =>
	fs
		.readdirSync(__dirname + "/tmp")
		.filter((fileName) => !except.includes(fileName))
		.forEach((fileName) => fs.unlinkSync(__dirname + "/tmp/" + fileName));

export const validateUrl = (url?: string): boolean => {
	try {
		const validUrl = new URL(url);
		return ["http:", "https:"].includes(validUrl.protocol);
	} catch (err) {
		return false;
	}
};
