import fs from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

/**
 * Import JS modules from provded folder
 * 
 */
const importModules = async (folder, callback) => {
    const files = fs
        .readdirSync(folder)
        .filter(f => f.endsWith(".js"));

    const currentDir = fileDirName(import.meta.url);
    const relativePath = relative(currentDir, folder);

    for (const file of files) {
        const path = "./" + join(relativePath, file).replace(/\\/g, "/");
        const module = await import(path);

        callback(module.default);
    }
}

/**
 * Extract directory name of the file URL
 * 
 */
const fileDirName = (url) => {
    return dirname(fileURLToPath(url));
}

export {
    importModules,
    fileDirName
}
