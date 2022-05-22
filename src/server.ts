import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles, validateUrl } from "./util/util";

(async () => {
	// Init the Express application
	const app = express();

	// Set the network port
	const port = process.env.PORT || 8082;

	// Use the body parser middleware for post requests
	app.use(bodyParser.json());

	/*	1. validate the image_url query
		2. call filterImageFromURL(image_url) to filter the image
		3. send the resulting file in the response
		4. deletes any files on the server on finish of the response
	QUERY PARAMATERS
		image_url: URL of a publicly accessible image
	RETURNS
		the filtered image file */
	app.get("/filteredimage", async (req, res) => {
		const image_url = req.query.image_url as string | undefined;
		if (!validateUrl(image_url)) {
			res.status(422).send("Can not get Image: Wrong URL");
		}

		try {
			const imgPath = await filterImageFromURL(image_url);
			res.sendFile(imgPath);
			deleteLocalFiles(imgPath);
		} catch (err) {
			res.status(422).send(err);
		}
	});

	// Root Endpoint
	// Displays a simple message to the user
	app.get("/", async (req, res) => {
		res.send("try GET /filteredimage?image_url={{}}");
	});

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`);
		console.log(`press CTRL+C to stop server`);
	});
})();
