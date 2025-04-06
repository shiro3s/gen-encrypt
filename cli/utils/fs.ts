import fs from "node:fs";

export const fileStatus = (path: string) => {
	try {
		return fs.statSync(path);
	} catch {
		return;
	}
};

export const readFile = (path: string) => {
	return fs.readFileSync(path);
};

export const readDir = (path: string, callback?: (path: string) => void) => {
	const dir = <string[]>fs.readdirSync(path, { recursive: true });

	for (let i = 0; i < dir.length; i++) {
		const dirPath = `${path}/${dir[i]}`;

		const stat = fileStatus(dirPath);
		if (stat?.isDirectory()) {
			readDir(dirPath);
		} else {
			callback?.(dirPath);
		}
	}
};

export const writeFile = (
	path: string,
	data: string | Buffer<ArrayBufferLike>,
) => {
	return fs.writeFileSync(path, data);
};

export const mkdir = (path: string) => {
	return fs.mkdirSync(path, { recursive: true });
};
