#!/usr/bin/env node
// Copy this archive's native modules into a SnowLuma checkout.
//
//   node scripts/install-into-snowluma.mjs /path/to/SnowLuma
//
// The release bundles already ship these files; this is only needed when the
// project is built from source, where packages/runtime/native supplies them.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];

if (!target) {
    console.error('usage: node scripts/install-into-snowluma.mjs <snowluma-checkout>');
    process.exit(1);
}

const checkout = path.resolve(target);
if (!existsSync(path.join(checkout, 'packages', 'runtime'))) {
    console.error(`not a SnowLuma checkout: ${checkout}`);
    process.exit(1);
}

const source = path.join(repoRoot, 'native');
const destination = path.join(checkout, 'packages', 'runtime', 'native');

let copied = 0;

// Walk the archive instead of listing names so the script keeps working when
// the published set grows.
function copyNativeModules(from, to) {
    mkdirSync(to, { recursive: true });

    for (const entry of readdirSync(from, { withFileTypes: true })) {
        const entrySource = path.join(from, entry.name);
        const entryTarget = path.join(to, entry.name);

        if (entry.isDirectory()) {
            copyNativeModules(entrySource, entryTarget);
            continue;
        }

        if (!/\.(node|so|dll|dylib)$/.test(entry.name)) {
            continue;
        }

        copyFileSync(entrySource, entryTarget);
        console.log(`  ${path.relative(repoRoot, entrySource)} (${statSync(entryTarget).size} B)`);
        copied += 1;
    }
}

copyNativeModules(source, destination);
console.log(`copied ${copied} native modules into ${destination}`);
