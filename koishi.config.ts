import "dotenv/config";
import { App } from "@koishijs/cli";
import { Dict } from "koishi";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { load, dump } from "js-yaml";
const { QQID, PASSWORD, DATABASE } = process.env;
console.log();
const mirai = resolve(process.cwd(), "go-mirai/config.yml");
if (existsSync(mirai) && QQID !== "") {
    const _config = load(readFileSync(mirai, "utf8")!)! as {
        account: {
            uin: number;
            password: string;
        };
    };
    const account = _config.account;
    account.uin = Number(QQID);
    account.password = PASSWORD;
    writeFileSync(mirai, dump(_config), { encoding: "utf8" });
}
const port = 8080;
const watch = {
    root: "src",
};
const plugins: Dict = {
    "./src/ping": {},
    "adapter-onebot": {
        bots: {
            protocol: "ws",
            selfId: QQID,
            endpoint: "ws://127.0.0.1:6700",
        },
    },
    console: {},
    insight: {},
    logger: {},
    status: {},
};
if (DATABASE !== "false") {
    plugins["database-mongo"] = {
        protocol: "mongodb",
        host: "localhost",
        port: 27017,
        database: "koishi",
    };
    plugins.dataview = {};
    plugins.admin = {};
    plugins.teach = {};
    plugins.manager = {};
}
const allowWrite = true;
const config: App.Config = {
    watch,
    port,
    allowWrite,
    plugins,
};

module.exports = config;
