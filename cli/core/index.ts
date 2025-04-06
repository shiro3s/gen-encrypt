import { decrypt, encrypt } from "../utils/crypto";
import { fileStatus, mkdir, readDir, readFile, writeFile } from "../utils/fs";
import { dirname } from "../utils/path";

export const genEncrypt = (
	path: string,
	password: string,
	salt: string,
	decode?: boolean,
) => {
	// remove last slash
	const inputPath = path.replace(/\/$/, "");
	try {
		const stat = fileStatus(inputPath);

		// 指定したファイルまたはディレクトリが見つからなければエラーを返す
		if (!stat) throw new Error("No such File or Directory");

		if (stat.isDirectory()) {
			readDir(inputPath, (p) => {
				writeEncryptedData(p, password, salt, decode);
			});
		} else {
			writeEncryptedData(path, password, salt, decode);
		}
	} catch (error) {
		if (error instanceof Error) console.log(error?.message);
	}
};

const writeEncryptedData = (
	path: string,
	password: string,
	salt: string,
	decode?: boolean,
) => {
	const outputPath = decode
		? `./decrypted/${path.replace("encrypted/", "")}`
		: `./encrypted/${path}`;

	const dir = dirname(outputPath);
	const stat = fileStatus(dir);

	if (!stat) mkdir(dir);

	try {
		const inputData = readFile(path);
		const encryptedData = decode
			? decrypt(inputData, password, salt)
			: encrypt(inputData, password, salt);

		writeFile(outputPath, encryptedData);
	} catch (error) {
		if (error instanceof Error) console.log(error?.message);
	}
};
