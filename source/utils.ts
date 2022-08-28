import path = require("path");

function random_range(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min)) + min;
}

function get_views_path(file_name: string): string {
    return path.join(process.cwd(), "public/views", file_name);
}

export = {random_range, get_views_path};