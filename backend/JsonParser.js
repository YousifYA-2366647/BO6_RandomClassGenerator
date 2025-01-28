import fs from "fs/promises";

export async function getWeaponsFromJson(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("error reading file: " + err);
        throw err;
    }
}