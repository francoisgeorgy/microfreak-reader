
const MAX_FILE_SIZE = 1000000;

export async function readFile(file) {

    // let url = window.URL.createObjectURL(new Blob([JSON.stringify(this.props.state.presets)], {type: "application/json"}));

    if (global.dev) console.log("readFile", file);
    let data = null;
    // await Promise.all(files.map(
    //     async file => {
            if (file.size > MAX_FILE_SIZE) {
                console.warn(`${file.name}: file too big, ${file.size}`);
            } else {
                // json(): Takes a Response stream and reads it to completion. It returns a promise that resolves
                //         with the result of parsing the body text as JSON.
                data = await new Response(file).json();
                console.log(data);
                // this.props.state.presets = JSON.parse(await new Response(file).json());
            }
            // too big files are ignored
        // }
    // ));
    // if (global.dev) console.log("readFiles: return", hs(bytes));
    return data;
}
