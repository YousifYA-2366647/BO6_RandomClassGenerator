import fs from "fs/promises";

export class JsonParser {
    JsonParser() {};

    retrievedData = {};
    seenFiles = [];
    
    async getWeaponsFromJson(filename) {
        try {
            if (!this.retrievedData[filename] || !this.seenFiles.includes(filename)) {
                const data = await fs.readFile(filename, 'utf8');
                this.retrievedData[filename] = JSON.parse(data);
                this.seenFiles.push(filename);
            }
            return JSON.parse(JSON.stringify(this.retrievedData[filename]));
        } catch (err) {
            console.log(filename);
            console.error("error reading file: " + err);
            throw err;
        }
    }
}