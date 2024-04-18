import config from "../config";

const getTimestamp = (): string => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 23).replace("T", " ");
    const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
    return `[${timestamp}.${milliseconds}]`;
};

export const log = (message: string) => {
    if (config.debug) {
        console.log(`${getTimestamp()} ${message}`);
    }
};

export const error = (message: string) => {
    if (config.debug) {
        console.error(`${getTimestamp()} ${message}`);
    }
};

export const warn = (message: string) => {
    if (config.debug) {
        console.warn(`${getTimestamp()} ${message}`);
    }
};

export const info = (message: string) => {
    if (config.debug) {
        console.info(`${getTimestamp()} ${message}`);
    }
};

export const debug = (message: string) => {
    if (config.debug) {
        console.debug(`${getTimestamp()} ${message}`);
    }
};

export const trace = (message: string) => {
    if (config.debug) {
        console.trace(`${getTimestamp()} ${message}`);
    }
};