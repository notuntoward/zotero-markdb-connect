// Constants
const OBSIDIAN_TIMEOUT_MS = 15000;
const POLLING_INTERVAL_MS = 2000;
const API_URL = "https://127.0.0.1:27123";

// --- Helper Functions ---

/** Checks if the Obsidian OS process is listed in tasklist/ps */
async function isObsidianProcessRunning(): Promise<boolean> {
    // ... (Use the Subprocess code from previous step) ...
    return false; // Placeholder
}

/** Pings the API to see if the plugin is loaded and listening */
async function isApiReady(apiKey: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 500); // fast fail
        const res = await fetch(`${API_URL}/`, { 
            headers: { "Authorization": `Bearer ${apiKey}` },
            signal: controller.signal 
        });
        return res.ok;
    } catch { return false; }
}

/** Launches Obsidian to the vault picker or last vault (No-Op) */
function launchObsidianApp(vault: string) {
    Zotero.launchURL(`obsidian://open?vault=${encodeURIComponent(vault)}`);
}

// --- Main Logic ---

/**
 * Ensures Obsidian is open AND (ideally) the API is ready.
 * Returns 'API_READY' if we can use new tabs, 'PROCESS_ONLY' if we must fallback, or 'FAILED' if it won't open.
 */
async function ensureObsidianReady(vault: string, apiKey: string): Promise<"API_READY" | "PROCESS_ONLY" | "FAILED"> {
    
    let isRunning = await isObsidianProcessRunning();

    // 1. If not running, launch it
    if (!isRunning) {
        launchObsidianApp(vault);
        // Wait a moment for the process to physically spawn before we start checking
        await new Promise(r => setTimeout(r, 2000)); 
    }

    // 2. Poll Loop: Wait for API to come online
    // We wait regardless of whether we just launched it or it was already open
    // because "Running" doesn't mean "API Loaded".
    const startTime = Date.now();
    
    while ((Date.now() - startTime) < OBSIDIAN_TIMEOUT_MS) {
        // Check API first (Strongest Success)
        if (await isApiReady(apiKey)) {
            return "API_READY";
        }

        // If API isn't ready, check if process is at least running
        // If the process dies (crash), we should abort early
        if (!await isObsidianProcessRunning()) {
            // If we launched it and it's gone, it crashed or failed to start.
             if ((Date.now() - startTime) > 5000) return "FAILED";
        }

        // Yield/Sleep
        await new Promise(r => setTimeout(r, POLLING_INTERVAL_MS));
    }

    // 3. Timeout Reached
    // If process is running but API never answered, we settle for "PROCESS_ONLY"
    return (await isObsidianProcessRunning()) ? "PROCESS_ONLY" : "FAILED";
}
