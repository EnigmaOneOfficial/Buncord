import config from "../config";

const getTimestamp = (): string => {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");
	const seconds = now.getSeconds().toString().padStart(2, "0");
	const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
	return `[${hours}:${minutes}:${seconds}.${milliseconds}]`;
};

export const log = (...message: string[]) => {
	if (config.debug) {
		console.log(`${getTimestamp()} ${message}`);
	}
};

export const error = (...message: string[]) => {
	if (config.debug) {
		console.error(`${getTimestamp()} ${message}`);
	}
};

export const warn = (...message: string[]) => {
	if (config.debug) {
		console.warn(`${getTimestamp()} ${message}`);
	}
};

export const info = (...message: string[]) => {
	if (config.debug) {
		console.info(`${getTimestamp()} ${message}`);
	}
};

export const debug = (...message: string[]) => {
	if (config.debug) {
		console.debug(`${getTimestamp()} ${message}`);
	}
};

export const trace = (...message: string[]) => {
	if (config.debug) {
		console.trace(`${getTimestamp()} ${message}`);
	}
};

export const table = (data: object) => {
	if (config.debug) {
		console.log(getTimestamp());
		console.table(data);
	}
};
