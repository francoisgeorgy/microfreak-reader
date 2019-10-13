
const MAX_FILE_SIZE = 1000000;

export async function readFile(file) {

    if (global.dev) console.log("readFile", file);
    let bytes = null;
    // await Promise.all(files.map(
    //     async file => {
            if (file.size > MAX_FILE_SIZE) {
                console.warn(`${file.name}: file too big, ${file.size}`);
            } else {
                const data = new Uint8Array(await new Response(file).json());
                // console.log(data);
                // if (isSysexData(data)) {
                //     if (bytes === null) {
                //         bytes = data;
                //     } else {
                //         // merge sysex bytes
                //         const a = new Uint8Array(bytes.length + data.length);
                //         a.set(bytes);
                //         a.set(data, bytes.length);
                //         bytes = a;
                //     }
                //     if (global.dev) console.log(`readFiles: patch file loaded: ${file.name}, ${bytes.length} bytes`);
                // } else {
                //     console.warn(`The file ${file.name} does not contain a patch (is not a binary sysex file)`);
                // }
                // non sysex files are ignored
            }
            // too big files are ignored
        // }
    // ));
    // if (global.dev) console.log("readFiles: return", hs(bytes));
    return bytes;
}
