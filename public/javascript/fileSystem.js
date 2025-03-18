async function getFilesFromFolder(directory) {
    try {
        // Prompt user to select a directory
        const directoryHandle = directory
        const fileList = [];

        for await (const [name, handle] of directoryHandle.entries()) {
            if (handle.kind === "file") {
                fileList.push(name);
            }
        }

        console.log("Files in folder:", fileList);
    } catch (err) {
        console.error("Error:", err);
    }
}   
