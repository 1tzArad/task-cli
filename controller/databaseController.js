"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const fs = require("fs");
const path = require("path");
const enum_1 = require("../utils/enum");
class Database {
    constructor() {
        this.dbFile = "database.json";
        if (!fs.existsSync(this.dbFile)) {
            fs.writeFileSync(this.dbFile, "{}");
        }
    }
    create(title) {
        try {
            const status = enum_1.TaskStatus.NOT_DONE;
            const Timestamp = Date.now();
            const UnixTimestamp = Math.floor(Timestamp / 1000);
            const data = JSON.parse(fs.readFileSync(this.dbFile, "utf8"));
            // if(Object.keys)
            const keys = Object.keys(data);
            const id = keys.length + 1;
            for (const key of keys) {
                if (title == key)
                    return 409;
            }
            data[title] = {
                id: id,
                status: status,
                createdAt: UnixTimestamp,
                updatedAt: UnixTimestamp,
            };
            fs.writeFileSync(this.dbFile, JSON.stringify(data, null, 2));
            return id;
        }
        catch (error) {
            console.error(`there was an error while extracting create method!\nERROR:  ` + error);
        }
    }
    update(id, title) {
        const Timestamp = Date.now();
        const UnixTimestamp = Math.floor(Timestamp / 1000);
        const data = JSON.parse(fs.readFileSync(this.dbFile, "utf8"));
        const keys = Object.keys(data);
        let found = false;
        for (const key of keys) {
            if (data[key].id == id) {
                data[key].updatedAt = UnixTimestamp;
                data[title] = data[key];
                delete data[key];
                found = true;
                break;
            }
        }
        if (!found)
            return 404;
        fs.writeFileSync(this.dbFile, JSON.stringify(data, null, 2));
        return id;
    }
    delete(id) {
        const data = JSON.parse(fs.readFileSync(this.dbFile, "utf8"));
        const keys = Object.keys(data);
        let found = false;
        for (const key of keys) {
            if (data[key].id == id) {
                delete data[key];
                found = true;
                break;
            }
        }
        if (!found)
            return 404;
        fs.writeFileSync(this.dbFile, JSON.stringify(data, null, 2));
        return true;
    }
    getAll(filter = null) {
        const data = JSON.parse(fs.readFileSync(this.dbFile, "utf8"));
        const keys = Object.keys(data);
        const result = [];
        if (filter !== null) {
            for (const key of keys) {
                if (data[key].status == filter)
                    result.push(data[key]);
            }
        }
        else
            return data;
        return result.length > 0 ? result : 404;
    }
    updateTaskStatus(id, status) {
        try {
            const data = JSON.parse(fs.readFileSync(this.dbFile, "utf8"));
            const Timestamp = Date.now();
            const UnixTimestamp = Math.floor(Timestamp / 1000);
            const keys = Object.keys(data);
            let found = false;
            for (const key of keys) {
                if (data[key].id == id) {
                    data[key].updatedAt = UnixTimestamp;
                    data[key].status = status;
                    // delete data[key];
                    found = true;
                    break;
                }
            }
            if (!found)
                return 404;
            fs.writeFileSync(this.dbFile, JSON.stringify(data, null, 2));
            return 201;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.Database = Database;