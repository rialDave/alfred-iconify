# Alfred-Iconify
[Alfred](https://www.alfredapp.com/) Workflow to search iconify icons

Overview: https://icon-sets.iconify.design/

![Usage Screenshot](/docs/usage_screenshot.png)

## How to use

Install the Workflow via the bundled .alfredworkflow file (in the output folder, or from the latest [release](https://github.com/rialDave/alfred-iconify/releases/)).

Type an icon name from Iconify to find and copy its identifier.
Please always respect the related licenses of icons.
Overview: https://icon-sets.iconify.design/

You can also define your preferred icon namespace (e.g. "mdi" for material design icons, as seen in the screenshot above)

Hotkey: `⌘` + `⌃` + `I`

Search trigger: `"icon [query]"`

## Features / Roadmap

* [x] initial functionality to search icons and copy identifier to clipboard
* [x] allow setting a preferred namespace for ordering (and extended/more specific search)
* [ ] Maybe "caching" / API limit improvements
  * [ ] only download icons that aren't downloaded from previous queries (test how big the directory would get)
  * [ ] clear download folder every x-runs or when it's bigger than size x

## Development

1. Install the workflow via Alfred
2. Set the path to your workflow in the .env file
3. Use the available make tasks
   * `make copy-to-alfred`: updates the workflow files in alfred
   * `make copy-info-from-alfred`: updates the project info.plist from alfred (if you made changes to your config via Alfred GUI)
   * `run-workflow`: starts the workflow with "sun" as example input
   * `bundle-workflow`: bundles the workflow for delivery (always to be done before releases)