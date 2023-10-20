const fs = require('fs/promises');
const next_json = require('../sidebars.js');
let versions = [];

const lookupMap = new Map()
    .set('ctiApiSidebar', 'cti_api')
    .set('bouncersSidebar', 'bouncers');

const merge_sidebars = async (key, check = false) => {
    for (let i = 0; i < versions.length; i++) {
        const version = versions[i];
        const versionedSidebarPath = `./versioned_sidebars/version-${version}-sidebars.json`;
        const versionedJson = JSON.parse(await fs.readFile(versionedSidebarPath, 'utf8'));
        if (i === 0) {
            if (!check || check && versionedJson[key]) {
                versionedJson[key] = next_json[key];
            }
        } else {
            const version_key = `version-${version}/${key}`;
            if (!check || check && versionedJson[version_key]) {
                versionedJson[version_key] = next_json[key];
            }
        }
        await symlink(`../../docs/${lookupMap.get(key)}`, `./versioned_docs/version-${version}/${lookupMap.get(key)}`)
        await fs.writeFile(versionedSidebarPath, JSON.stringify(versionedJson, null, 2));
    }
}

const symlink = async (to, from) => {
    try {
        await fs.unlink(from);
    } catch (e) {
        //ignore
    }
    await fs.symlink(to, from);

}

//IFI (Immediately Invoked Function Expression)
(async () => {
    versions = JSON.parse(await fs.readFile('./versions.json', 'utf8'))
    await merge_sidebars(`ctiApiSidebar`);
})()