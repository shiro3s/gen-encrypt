#!/usr/bin/env node

import { Command } from "commander";
import { genEncrypt } from "./core";

type Option = {
	input: string;
	password: string;
	salt: string;
	decode?: boolean;
};

const program = new Command();

program
	.name("gen-crypto")
	.description(
		"Generate encrypted files for files under the specified directory",
	)
	.version("v1.0.0", "-v, --version")
	.requiredOption("-i, --input <directory or file>", "Input directory or file")
	.requiredOption("-p, --password <password>", "Password for encryption")
	.option("-s, --salt [salt]", "Any value")
	.option("-d, --decode");

program.parse();

const options: Option = program.opts();
const salt = typeof options.salt === "string" ? options.salt : "";

genEncrypt(options.input, options.password, salt, options.decode);
