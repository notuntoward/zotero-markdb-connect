[![GitHub release (latest by date)](https://img.shields.io/github/v/release/daeh/zotero-markdb-connect?style=for-the-badge)](https://github.com/daeh/zotero-markdb-connect/releases/latest) [![GitHub Downloads all releases](https://img.shields.io/github/downloads/daeh/zotero-markdb-connect/total?style=for-the-badge&color=forestgreen)](https://github.com/daeh/zotero-markdb-connect/releases/latest) [![GitHub Downloads (latest release)](https://img.shields.io/github/downloads/daeh/zotero-markdb-connect/latest/total?style=for-the-badge)](https://github.com/daeh/zotero-markdb-connect/releases/latest)

# MarkDB-Connect (Zotero Markdown DataBase Connect)

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org) [![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

- **_Scans your Markdown database and adds a colored tag to associated Zotero items._**
- **_Jump to Markdown notes from the contextual menu of Zotero items._**
- **_Supports various Markdown databases, including [Obsidian](https://obsidian.md), [logseq](https://logseq.com), and [Zettlr](https://www.zettlr.com)._**
- **_Zotero 8 compatible._**

![MarkDBConnectScreenshot](./docs/assets/readme/MarkDBConnectScreenshot.png)

This is a plugin for [Zotero](https://www.zotero.org), a research source management tool. The _MarkDB-Connect_ plugin searches a user-defined folder for markdown files that include a [Better BibTeX](https://retorque.re/zotero-better-bibtex/) citekey or Zotero-Item-Key, and adds a colored tag to the corresponding Zotero items.

This plugin was initially designed with the [Obsidian](https://obsidian.md) markdown editor in mind, and was inspired by the [obsidian-citation-plugin](https://github.com/hans/obsidian-citation-plugin) workflow. It offers preliminary support for [logseq](https://logseq.com) and [Zettlr](https://www.zettlr.com). It can be adapted to other databases that store markdown files outside of Zotero, and to other workflows that generate markdown reading notes linked to Zotero items (such as Zotero’s `Export Note` feature).

Please post any bugs, questions, or feature requests in the GitHub repository’s [issues](https://github.com/daeh/zotero-markdb-connect/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## Features

*   **Scans for Markdown Notes**: Recursively scans a user-defined directory for Markdown files associated with Zotero items.
*   **Colored Tags**: Adds a customizable, colored tag to Zotero items that have corresponding Markdown notes, providing a clear visual indicator.
*   **Open Notes Directly**: Right-click on a Zotero item and select "Open Note" to jump directly to the corresponding Markdown file in your preferred editor.
*   **Multiple Note Support**: A single Zotero item can be linked to multiple Markdown files.
*   **Obsidian Integration**:
    *   **Standard URI**: Opens notes using the default `obsidian://` URI scheme.
    *   **Advanced URI Plugin**: Supports opening notes in a new pane with the [Obsidian Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) plugin.
    *   **Local REST API**: For faster note opening, the plugin can interact with the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api).
*   **Logseq and Zettlr Support**: Provides preliminary support for opening notes in Logseq and other Markdown editors like Zettlr.
*   **Flexible Note Matching**:
    *   **Better BibTeX Citekeys**: Match notes using Better BibTeX citekeys found in the filename, YAML frontmatter, or file content.
    *   **Zotero Item Keys**: Match notes using Zotero Item Keys, compatible with notes exported from Zotero.
*   **Customizable**:
    *   Define custom regular expressions for file and content matching.
    *   Customize the tag name.
    *   Choose whether to include group libraries.
    *   Optionally, keep tags even when the corresponding note is not found.

## Installation

- Download the plugin (the `.xpi` file) from the [latest release](https://github.com/daeh/zotero-markdb-connect/releases/latest).
- Open Zotero (version 7.x or 8.x).
- From `Tools -> Plugins`.
- Select `Install Add-on From File...` from the gear icon ⛭.
- Choose the `.xpi` file you downloaded (e.g. `markdb-connect.xpi`).
- Restart Zotero.

> [!NOTE]
> The last release for Zotero 6 was [`v0.0.27`](https://github.com/daeh/zotero-markdb-connect/releases/tag/v0.0.27).

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
    - FYI There's a nice [configuration tutorial](https://publish.obsidian.md/history-notes/Option+-+Link+from+a+Zotero+item+back+to+related+notes+in+Obsidian) detailing a common use case (thanks to Prof. Elena Razlogova).
2.  Using **Zotero Item Keys** to link markdown files to Zotero items.
    - This is recommended if you created the markdown notes with the `Export Note` feature of Zotero.
    - The markdown note contents should include the Zotero-Item-Key in a consistent format.

NOTE: multiple markdown files can point to the same Zotero item. But a given markdown file should only be linked to a single Zotero item. A markdown reading note can reference multiple Zotero items throughout the file, but _MarkDB-Connect_ will only link the markdown note to one BetterBibTeX-citekey / Zotero-Item-Key.

---

### Opening Notes

Once your notes are synced, you can open them directly from Zotero:

1.  Right-click on a Zotero item that has the colored tag.
2.  Select "Open Note" from the context menu.

This will open the corresponding Markdown file in your configured editor.

#### Obsidian Configuration

If you use Obsidian, you can choose how MarkDB-Connect interacts with it in the plugin's preferences:

-   **Standard URI (default)**: This is the simplest method. It uses the standard `obsidian://open` URI to open the note. It will open the note in the current pane.

-   **Advanced URI Plugin**: This mode uses the [Obsidian Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) plugin to open notes. This allows you to open notes in a new pane. You must have the Advanced URI plugin installed and enabled in Obsidian for this to work.

-   **Local REST API Plugin**: This mode provides the fastest and most reliable way to open notes. It communicates directly with the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) plugin. You must have the Local REST API plugin installed and enabled in Obsidian. You will also need to enter the port number and API key from the Local REST API plugin's settings into the MarkDB-Connect preferences in Zotero.

<details>

<summary>Detailed Configuration Steps</summary>

-   In Zotero's Settings, click the `MarkDB-Connect` preference pane.
-   Under "Open Markdown Files using:", select "Obsidian".
-   Choose your preferred interaction mode: "Standard URI", "Advanced URI Plugin", or "Local REST API Plugin".
-   If you select "Local REST API Plugin", enter the Port and API Key from your Obsidian Local REST API plugin settings.

</details>

---

## Example Markdown Note

In this example markdown note (`@saxe2017emobtom.md`), _MarkDB-Connect_ will use the [YAML metadata](https://help.obsidian.md/Advanced+topics/YAML+front+matter) keyword `citekey` to find the BetterBibTeX citekey (`saxe2017emobtom`) that determines which Zotero item to associate with the markdown file. Notice that the markdown file can include other BetterBibTeX citekeys and Zotero-Item-Keys, which are ignored by the plugin.

```markdown
---
citekey: saxe2017emobtom
zoterouri: zotero://select/library/items/IACZMXU4
bbturi: zotero://select/items/@saxe2017emobtom
doi: 10.1016/j.copsyc.2017.04.019
---

# @saxe2017emobtom

**Formalizing emotion concepts within a Bayesian model of theory of mind**
(2017) _Current Opinion in Psychology_
[Open in Zotero](zotero://select/library/items/IACZMXU4)

The body of notes can include references to other Zotero items.
The _MarkDB-Connect_ plugin will only link this file to one Zotero item
(in this case, it will use the value of the `citekey` property).

Here are links to other papers:

-   This one uses [a Zotero URI](zotero://select/library/items/4RJ97IFL)
-   This one uses [a BetterBibTeX URI](zotero://select/items/@anzellotti2021opaque)
-   This one uses an Obsidian wiki link: [[@cusimano2018cogsci]]
```

<details>

<summary>Example Templates</summary>

Below are example templates for various Obsidian plugins

#### Template for [obsidian-citation-plugin](https://github.com/hans/obsidian-citation-plugin)

```md
---
citekey: "{{citekey}}"
title: "{{title}}"
year: {{year}}
authors: [{{authorString}}]
{{#if containerTitle~}} publication: "{{containerTitle}}" {{~else~}} {{~/if}}
{{#if DOI~}} doi: "{{DOI}}" {{~else~}} {{~/if}}
aliases: ["@{{citekey}}", "@{{citekey}} {{title}}"]
tags: 
 - readingNote
---

# @{{citekey}}

**{{title}}**
{{authorString}}
{{#if year~}} ({{year}}) {{~else~}} {{~/if}} {{~#if containerTitle}} _{{containerTitle~}}_ {{~else~}} {{~/if}}
[Open in Zotero]({{zoteroSelectURI}})
```

#### Template for ZotLit

Make a file (e.g. `zotlit-properties.eta.md`) with the following contents, and point to that file in ZotLit settings: `Template` > `Note Properties`.

```eta
citekey: "<%= it.citekey %>"
title: "<%= it.title %>"
<% if (it.date) { %>year: <%= it.date %><% } %>
authors: [<%= it.authors.map(v => v.firstName + ' ' + v.lastName) %>]
<% if (it.publicationTitle) { %>publication: "<%= it.publicationTitle %>"<% } %>
<% if (it.DOI) { %>doi: "<%= it.DOI %>"<% } %>
aliases: ["@<%= it.citekey %>", "@<%= it.citekey %> <%= it.title %>"]
tags:
 - readingNote
```

</details>

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
    -   Obsidian plugin that integrates your Zotero database with Obsidian.
-   [BibNotes Formatter](https://github.com/stefanopagliari/bibnotes) by stefanopagliari
    -   Obsidian plugin to facilitate exporting annotations from Zotero into Obsidian.
-   [Obsidian Zotero Integration](https://github.com/mgmeyers/obsidian-zotero-integration) by mgmeyers
    -   Obsidian plugin to facilitate exporting annotations from Zotero into Obsidian.
-   [Zotero 6 'Export Notes' feature](https://forums.zotero.org/discussion/93521/available-for-beta-testing-markdown-export-of-notes/p1) by Zotero
    -   Zotero 6 beta feature to export notes and annotations from Zotero items as markdown files.
-   [Zotero to Markdown](https://github.com/e-alizadeh/Zotero2md) by e-alizadeh
    -   Python library to export annotations and notes from Zotero items as markdown files.
-   [Zotero Better Notes](https://github.com/windingwind/zotero-better-notes) by windingwind
    -   A Zotero plugin for note management.
-   [Logseq Citations Plugin](https://github.com/sawhney17/logseq-citation-manager) by sawhney17
    -   Logseq plugin that integrates your Zotero database with Logseq.

<!-- [Zotero-mdnotes](https://argentinaos.com/zotero-mdnotes/) by argenos
Zotero plugin to export metadata and notes from Zotero items as markdown files. -->

## Notes

[GitHub](https://github.com/daeh/zotero-markdb-connect): Source code repository

This extension uses the [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template).

## License

Distributed under the MIT License.

## Author

[![Personal Website](https://img.shields.io/badge/personal%20website-daeh.info-orange?style=for-the-badge)](https://daeh.info) [![BlueSky](https://img.shields.io/badge/bsky-@dae.bsky.social-skyblue?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/dae.bsky.social)
