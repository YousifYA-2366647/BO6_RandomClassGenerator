import fs from "fs/promises";

// JsonParser will be responsible for reading .json files and returning a Json object containing the data of that file.
export class JsonParser {
    JsonParser() {};

    // JsonParser objects keep the files that it has already parsed and the data it found.
    // this way it won't have to load things more than once.
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