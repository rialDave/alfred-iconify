const downloadFolder = "IconifyIcons";
const apiUrlBase = "https://api.iconify.design/";
const apiUrlSearch = apiUrlBase + "search?query=";
const items = [];

function getEnv(name) {
  if (typeof $ === 'undefined') return process.env[name]

  ObjC.import('stdlib')
  try {
    return $.getenv(name)
  } catch (e) {
    return null
  }
}

function splitIconName(iconName) {
  const parts = iconName.split(':');
  if (parts.length !== 2) {
    return null;
  }
  return parts;
}

// define structure of items which Alfred expects
const alfredItem = (iconName) => {
  const iconNameParts = splitIconName(iconName);

  return {
    uid: iconName,
    arg: iconName,
    title: iconName,
    subtitle: `Press enter to copy and paste to foremost app`,
    autocomplete: iconNameParts[0],
    icon: { path: `./${downloadFolder}/${iconNameParts[0]}-${iconNameParts[1]}.svg` },
  }
}

function extractIcons(responseText) {
  const responseData = JSON.parse(responseText);

  // Extract icons array
  if (responseData && responseData.icons && responseData.icons.length > 0) {

    // Download all icons
    const icons = responseData.icons;

    icons.forEach(iconName => {
      try {
        // Convert icon name to URL
        const iconNameParts = splitIconName(iconName);

        const namespace = iconNameParts[0];
        const name = iconNameParts[1];
        const url = `${apiUrlBase}${namespace}/${name}.svg`;

        // Create filename
        const filename = iconName.replace(':', '-') + '.svg';
        const filePath = downloadFolder + "/" + filename;

        // Download the SVG
        const nsUrl = $.NSURL.URLWithString(url);
        const data = $.NSData.dataWithContentsOfURL(nsUrl);

        if (data) {
          data.writeToFileAtomically(filePath, true);
          items.push(alfredItem(iconName));
        } else {
          return { "items": [{ "title": "Failed downloading icon" + iconName, "valid": false }] };
        }
      } catch (error) {
        return { "items": [{ "title": "Error: " + error, "valid": false }] };
      }
    });
  }
}

function search(query) {
  // always re-download (delete download and create download folder)
  const fileManager = $.NSFileManager.defaultManager;
  fileManager.removeItemAtPathError(downloadFolder, $());
  fileManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(
      downloadFolder, true, $(), $()
  );

  // search for icons with preferred namespace prefix first
  if (getEnv('preferred_namespace')) {
    // Fetch results
    const responseTextPreferred = $.NSString.alloc.initWithDataEncoding(
        $.NSData.dataWithContentsOfURL($.NSURL.URLWithString(apiUrlSearch + encodeURIComponent(getEnv('preferred_namespace') + ':' + query))),
        $.NSUTF8StringEncoding
    ).js;
    // Parse response
    if (responseTextPreferred) {
      extractIcons(responseTextPreferred);
    }
  }

  // Search for icons without namespace prefix / default search
  const responseTextDefault = $.NSString.alloc.initWithDataEncoding(
      $.NSData.dataWithContentsOfURL($.NSURL.URLWithString(apiUrlSearch + encodeURIComponent(query))),
      $.NSUTF8StringEncoding
  ).js;
  // Parse response
  if (responseTextDefault) {
    extractIcons(responseTextDefault);
  }

  if (items) {
    return { items };
  }

  return { "items": [{ "title": "No icons found for that search term :(", "valid": false }] };
}

// main function
function run(argv) {
  const query = argv[0];

  const result = search(query);
  return JSON.stringify(result);
}