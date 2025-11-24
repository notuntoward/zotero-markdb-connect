[![GitHub release (latest by date)](https://img.shields.io/github/v/release/daeh/zotero-markdb-connect?style=for-the-badge)](https://github.com/daeh/zotero-markdb-connect/releases/latest) [![GitHub Downloads all releases](https://img.shields.io/github/downloads/daeh/zotero-markdb-connect/total?style=for-the-badge&color=forestgreen)](https://github.com/daeh/zotero-markdb-connect/releases/latest) [![GitHub Downloads (latest release)](https://img.shields.io/github/downloads/daeh/zotero-markdb-connect/latest/total?style=for-the-badge)](https://github.com/daeh/zotero-markdb-connect/releases/latest)

# MarkDB-Connect (Zotero Markdown DataBase Connect)

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org) [![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

- **_Scans your Markdown database and adds a colored tag to associated Zotero items._**
- **_Jump to Markdown notes from the contextual menu of Zotero items or with a keyboard shortcut._**
- **_Supports various Markdown databases, including [Obsidian](https://obsidian.md), [logseq](https://logseq.com), and [Zettlr](https://www.zettlr.com)._**
- **_Built for Zotero 7._**

![MarkDBConnectScreenshot](./docs/assets/readme/MarkDBConnectScreenshot.png)

This is a plugin for [Zotero 7](https://www.zotero.org), a research source management tool. The _MarkDB-Connect_ plugin searches a user-defined folder for markdown files that include a [Better BibTeX](https://retorque.re/zotero-better-bibtex/) citekey or Zotero-Item-Key, and adds a colored tag to the corresponding Zotero items.

This plugin was initially designed with the [Obsidian](https://obsidian.md) markdown editor in mind, and was inspired by the [obsidian-citation-plugin](https://github.com/hans/obsidian-citation-plugin) workflow. It offers preliminary support for [logseq](https://logseq.com) and [Zettlr](https://www.zettlr.com). It can be adapted to other databases that store markdown files outside of Zotero, and to other workflows that generate markdown reading notes linked to Zotero items (such as Zotero’s `Export Note` feature).

Please post any bugs, questions, or feature requests in the GitHub repository’s [issues](https://github.com/daeh/zotero-markdb-connect/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## Features

*   **Scans for Markdown Notes**: Recursively scans a user-defined directory for Markdown files associated with Zotero items.
*   **Colored Tags**: Adds a customizable, colored tag to Zotero items that have corresponding Markdown notes, providing a clear visual indicator.
*   **Open Notes Directly**: Right-click on a Zotero item and select "Open Note" or use a customizable keyboard shortcut (`Ctrl+O` by default) to jump directly to the corresponding Markdown file in your preferred editor.
*   **Warns if Note is Missing**: If a linked note file cannot be found, the plugin will display a warning.
*   **Handles Multiple Selections**: Opens notes for all selected Zotero items and gracefully skips any items where a note cannot be found.
*   **Multiple Note Support**: A single Zotero item can be linked to multiple Markdown files.
*   **Advanced Obsidian Integration**:
    *   Checks if Obsidian is running and if helper plugins are installed.
    *   **Local REST API Support**: For the fastest and most reliable experience, the plugin can interact with the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api).
    *   **Advanced URI Plugin Support**: Supports opening notes using the [Obsidian Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) plugin.
    *   **Standard URI Fallback**: If helper plugins aren't found, it falls back to the default `obsidian://` URI scheme.
*   **Flexible Note Matching**:
    *   **Better BibTeX Citekeys**: Match notes using Better BibTeX citekeys found in the filename, YAML frontmatter, or file content.
    *   **Zotero Item Keys**: Match notes using Zotero Item Keys, compatible with notes exported from Zotero.
*   **Highly Customizable**:
    *   **Open in New Tab**: When using the Obsidian Local REST API or Advanced URI plugins, you can choose to have notes open in a new tab.
    *   Define custom regular expressions for file and content matching.
    *   Customize the tag name and the YAML metadata keyword used for matching.
    *   Set a custom keyboard shortcut for opening notes.
    *   Choose whether to include group libraries.
    *   Optionally, keep tags even when the corresponding note is not found.

## Installation

- Download the plugin (the `.xpi` file) from the [latest release](https://github.com/daeh/zotero-markdb-connect/releases/latest).
- Open Zotero (version 7.x).
- Go to `Tools -> Add-ons`.
- Select `Install Add-on From File...` from the gear icon ⛭.
- Choose the `.xpi` file you downloaded (e.g. `markdb-connect.xpi`).
- Restart Zotero.

> [!NOTE]
> This plugin is for Zotero 7. The last release for Zotero 6 was [`v0.0.27`](https://github.com/daeh/zotero-markdb-connect/releases/tag/v0.0.27).

## Build from Source

To build the plugin from the source code, you'll need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/daeh/zotero-markdb-connect.git
    cd zotero-markdb-connect
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Build the plugin**:
    ```bash
    npm run build
    ```
4.  **Install in Zotero**:
    - The compiled `.xpi` file will be located in the `dist` directory.
    - Follow the installation instructions above to install the `.xpi` file in Zotero.

## Setup and Usage

### Syncing Notes

A markdown file can specify which Zotero item it's linked to using either a [Better BibTeX](https://retorque.re/zotero-better-bibtex/) citekey or a Zotero-Item-Key. I recommend using Better BibTeX citekeys when possible.

1.  Using **Better BibTeX citekeys** to link markdown files to Zotero items.
    - This is recommended if you created the markdown notes with [obsidian-citation-plugin](https://github.com/hans/obsidian-citation-plugin), [BibNotes Formatter](https://github.com/stefanopagliari/bibnotes), or [Obsidian Zotero Integration](https://github.com/mgmeyers/obsidian-zotero-integration).
    - The BetterBibTeX citekey can be taken from the filename, YAML metadata, or body of the markdown note.
2.  Using **Zotero Item Keys** to link markdown files to Zotero items.
    - This is recommended if you created the markdown notes with the `Export Note` feature of Zotero.
    - The markdown note contents should include the Zotero-Item-Key in a consistent format.

NOTE: multiple markdown files can point to the same Zotero item. But a given markdown file should only be linked to a single Zotero item.

---

### Opening Notes

Once your notes are synced, you can open them directly from Zotero:

1.  Right-click on a Zotero item that has the colored tag and select **Open Note** from the context menu.
2.  Or, select a Zotero item and use the keyboard shortcut (default is **`Ctrl+O`**).

This will attempt to open the corresponding Markdown file in your configured editor. If the note file does not exist at the expected path, a warning will be displayed.

---

### Obsidian Configuration

If you use Obsidian, you can choose how MarkDB-Connect interacts with it in the plugin's preferences. The plugin will check if Obsidian is ready and which, if any, helper plugins are installed.

-   **Local REST API Plugin (Recommended)**: This mode provides the fastest and most reliable way to open notes. You must have the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) plugin installed and enabled in Obsidian. You will also need to enter the **Port** and **API Key** from the Local REST API plugin's settings into the MarkDB-Connect preferences in Zotero.

-   **Advanced URI Plugin**: This mode uses the [Obsidian Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) plugin. You must have this plugin installed and enabled in your Obsidian vault for this to work. MarkDB-Connect will detect it automatically.

Both the **Local REST API** and **Advanced URI** modes support opening notes in a new Obsidian tab. You can enable this feature in the plugin's preferences.

-   **Standard URI (Fallback)**: This is the simplest method and does not support opening notes in a new tab. It uses the standard `obsidian://open` URI to open the note in the currently active pane. It will be used automatically if neither of the above helper plugins are detected.

---

### Customization

MarkDB-Connect offers several options to tailor it to your workflow, available in the plugin's preferences pane:

*   **Open in New Tab**: When using the Obsidian Local REST API or Advanced URI plugins, you can choose to have notes open in a new tab.
*   **Keyboard Shortcut**: Change the default `Ctrl+O` shortcut for opening notes to any combination you prefer.
*   **Custom Note Matching**: You can provide custom regular expressions to find the citekey/item key within your note's filename or content. The plugin will validate your input to ensure it is a valid regular expression.
*   **Metadata Keyword**: You can define the specific YAML frontmatter keyword the plugin should look for to find the citekey (e.g., `citekey`, `bibtexkey`, etc.). Note that this keyword cannot contain special characters like `'"!#$&()[]{}`, spaces, or line breaks.
*   **Tag Name**: Customize the name of the tag that MarkDB-Connect adds to Zotero items.
*   **Include Group Libraries**: Choose whether the plugin should also scan and tag items in your group libraries.
*   **Keep Tag**: Optionally, you can configure the plugin to keep the tag on a Zotero item even when the corresponding note file is no longer found.


## Suppressing the Zotero security notification

Recent builds of Zotero have introduced a security notification for external links. At present, Zotero does not remember the user's link preferences, so this alert is shown every time an application-specific URI is launched. You can suppress this warning by setting `security.external_protocol_requires_permission` to `false` in Zotero's advanced configuration.

![Zotero Security Notification](./docs/assets/readme/ExternalLinkNotificationScreenshot.png)

<details>

<summary>Instructions for modifying Zotero's advanced config</summary>

1.  Open Zotero Settings
2.  Click the "Advanced" tab
3.  Click the "Config Editor" button
4.  Click the "Accept Risk and Continue" button
5.  Search for `security.external_protocol_requires_permission`
6.  Double click the `security.external_protocol_requires_permission` item to toggle its value to `false`

</details>

## Related Projects

-   [obsidian-citation-plugin](https://github.com/hans/obsidian-citation-plugin) by hans
-   [BibNotes Formatter](https://github.com/stefanopagliari/bibnotes) by stefanopagliari
-   [Obsidian Zotero Integration](https://github.com/mgmeyers/obsidian-zotero-integration) by mgmeyers
-   [Zotero Better Notes](https://github.com/windingwind/zotero-better-notes) by windingwind

## Notes

[GitHub](https://github.com/daeh/zotero-markdb-connect): Source code repository

This extension uses the [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template).

## License

Distributed under the MIT License.

## Author

[![Personal Website](https://img.shields.io/badge/personal%20website-daeh.info-orange?style=for-the-badge)](https://daeh.info) [![BlueSky](https://img.shields.io/badge/bsky-@dae.bsky.social-skyblue?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/dae.bsky.social)
