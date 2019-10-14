
const MAX_FILE_SIZE = 1000000;

export async function readFile(file) {

    if (global.dev) console.log("readFile", file);
    let data = null;
    if (file.size > MAX_FILE_SIZE) {
        console.warn(`${file.name}: file too big, ${file.size}`);
    } else {
        // json(): Takes a Response stream and reads it to completion. It returns a promise that resolves
        //         with the result of parsing the body text as JSON.
        data = await new Response(file).json();
    }
    // files too big are ignored
    return data;
}
