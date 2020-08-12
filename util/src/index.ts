/**
 * RoactRodux Build Utility
 *
 * Since RoactRodux isn't natively supportable by roblox-ts, gotta write a script to replace the require with a roblox-ts require.
 */

import path = require("path");
import fs = require("fs-extra");

const srcDir = path.join(process.cwd(), "roact-rodux", "src");

function replaceRoactRequire(text: string) {
	text = text.replace(
		/^local Roact = require\([\w\.]+\.Roact\)/gi,
		`local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))\n` +
		`local Roact = TS.import(script, TS.getModule(script, "roact").roact.src)`
	);

	return text;
}

fs.readdir(srcDir, (err, files) => {
	fs.ensureDirSync(path.join(process.cwd(), "out"));

	if (err) {
		console.error(err);
	}
	const matching = files.filter(file => file.match(/^(\w+)\.lua$/));
	for (const matched of matching) {
		if (matched.match(/^(connect\.lua|StoreProvider\.lua)$/)) {
			console.log("replace", matched);

			let text = replaceRoactRequire(
				fs.readFileSync(path.join(srcDir, matched)).toString(),
			);

			fs.writeFileSync(path.join(process.cwd(), "out", matched), text);
		} else {
			fs.copyFileSync(
				path.join(srcDir, matched),
				path.join(process.cwd(), "out", matched),
			);
		}
	}
});
