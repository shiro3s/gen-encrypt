#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// cli/index.ts
var import_commander = require("commander");

// cli/utils/crypto.ts
var import_node_crypto = __toESM(require("crypto"));
var encrypt = (data, password, salt2) => {
  const key = import_node_crypto.default.scryptSync(password, salt2, 32);
  const iv = import_node_crypto.default.randomBytes(16);
  const cipher = import_node_crypto.default.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const encryptedData = Buffer.concat([authTag, encrypted]);
  return encryptedData;
};
var decrypt = (encryptedData, password, salt2) => {
  const authTag = encryptedData.slice(0, 16);
  const iv = encryptedData.slice(16, 32);
  const key = import_node_crypto.default.scryptSync(password, salt2, 32);
  const decipher = import_node_crypto.default.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decryptedData = Buffer.concat([
    decipher.update(encryptedData.slice(32)),
    decipher.final()
  ]);
  return decryptedData;
};

// cli/utils/fs.ts
var import_node_fs = __toESM(require("fs"));
var fileStatus = (path2) => {
  try {
    return import_node_fs.default.statSync(path2);
  } catch {
    return;
  }
};
var readFile = (path2) => {
  return import_node_fs.default.readFileSync(path2);
};
var readDir = (path2, callback) => {
  const dir = import_node_fs.default.readdirSync(path2, { recursive: true });
  for (let i = 0; i < dir.length; i++) {
    const dirPath = `${path2}/${dir[i]}`;
    const stat = fileStatus(dirPath);
    if (stat?.isDirectory()) {
      readDir(dirPath);
    } else {
      callback?.(dirPath);
    }
  }
};
var writeFile = (path2, data) => {
  return import_node_fs.default.writeFileSync(path2, data);
};
var mkdir = (path2) => {
  return import_node_fs.default.mkdirSync(path2, { recursive: true });
};

// cli/utils/path.ts
var import_node_path = __toESM(require("path"));
var dirname = (dir) => {
  return import_node_path.default.dirname(dir);
};

// cli/core/index.ts
var genCrypto = (path2, password, salt2, decode) => {
  const inputPath = path2.replace(/\/$/, "");
  try {
    const stat = fileStatus(inputPath);
    if (!stat) throw new Error("No such File or Directory");
    if (stat.isDirectory()) {
      readDir(inputPath, (p) => {
        writeEncryptedData(p, password, salt2, decode);
      });
    } else {
      writeEncryptedData(path2, password, salt2, decode);
    }
  } catch (error) {
    if (error instanceof Error) console.log(error?.message);
  }
};
var writeEncryptedData = (path2, password, salt2, decode) => {
  const outputPath = decode ? `./decrypted/${path2.replace("encrypted/", "")}` : `./encrypted/${path2}`;
  const dir = dirname(outputPath);
  const stat = fileStatus(dir);
  if (!stat) mkdir(dir);
  try {
    const inputData = readFile(path2);
    const encryptedData = decode ? decrypt(inputData, password, salt2) : encrypt(inputData, password, salt2);
    writeFile(outputPath, encryptedData);
  } catch (error) {
    if (error instanceof Error) console.log(error?.message);
  }
};

// cli/index.ts
var program = new import_commander.Command();
program.name("gen-crypto").description(
  "Generate encrypted files for files under the specified directory"
).version("v1.0.0", "-v, --version").requiredOption("-i, --input <directory or file>", "Input directory or file").requiredOption("-p, --password <password>", "Password for encryption").option("-s, --salt [salt]", "Any value").option("-d, --decode");
program.parse();
var options = program.opts();
var salt = typeof options.salt === "string" ? options.salt : "";
genCrypto(options.input, options.password, salt, options.decode);
