async function openNote(vault: string, filename: string, apiKey: string) {
    
    const state = await ensureObsidianReady(vault, apiKey);

    if (state === "FAILED") {
        // Show Alert: "Could not launch Obsidian"
        Services.prompt.alert(null, "Error", "Obsidian failed to start.");
        return;
    }

    if (state === "API_READY") {
        // Best Case: Use API for New Tab
        await fetch(`${API_URL}/open/${encodeURIComponent(filename)}?newLeaf=true`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
    } else {
        // Fallback: Process is running, but API is missing/broken
        // Use Standard URI
        const uri = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(filename)}`;
        Zotero.launchURL(uri);
        
        // Optional: Warn user that API is missing
    }
}
