import crypto from "node:crypto";

export const encrypt = (
	data: Buffer<ArrayBufferLike>,
	password: string,
	salt: string,
) => {
	const key = crypto.scryptSync(password, salt, 32);

	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

	const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);

	const authTag = cipher.getAuthTag();
	const encryptedData = Buffer.concat([authTag, encrypted]);

	return encryptedData;
};

export const decrypt = (
	encryptedData: Buffer<ArrayBufferLike>,
	password: string,
	salt: string,
) => {
	const authTag = encryptedData.slice(0, 16);
	const iv = encryptedData.slice(16, 32);

	const key = crypto.scryptSync(password, salt, 32);
	const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

	decipher.setAuthTag(authTag);

	const decryptedData = Buffer.concat([
		decipher.update(encryptedData.slice(32)),
		decipher.final(),
	]);

	return decryptedData;
};
