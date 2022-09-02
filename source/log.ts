const RED_TEXT    : string = "\x1b[31m";
const YELLOW_TEXT : string = "\x1b[33m";
const GREEN_TEXT  : string = "\x1b[32m";
const RESET_TEXT  : string = "\x1b[0m";

function info(message: string) {
    internal_log("INFO", GREEN_TEXT, message);
}

function warning(message: string) {
    internal_log("WARNING", YELLOW_TEXT, message);
}

function error(message: string) {
    internal_log("ERROR", RED_TEXT, message);
}

function internal_log(type: string, colour: string, message: string) {
    let timestamp = new Date().toISOString();

    console.log(`${timestamp} [${colour}${type}${RESET_TEXT}] ${message}`);
}

export = {
    info,
    warning,
    error
};