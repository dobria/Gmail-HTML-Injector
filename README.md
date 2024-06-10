
# Gmail HTML Injector

## Description
The Gmail HTML Injector extension enables users to inject custom HTML content directly into the Gmail compose window, allowing for a wide range of applications beyond just newsletters. This extension is perfect for creating visually appealing and interactive emails, whether for business, marketing, education, internal communication, customer support, or personal use. With its simple and intuitive popup interface, users can effortlessly enhance their emails with custom HTML, ensuring professional and consistent presentation every time.

## Features
- Inject custom HTML content into Gmail compose window
- Simple and intuitive popup interface for HTML input
- Real-time HTML injection with a click of a button

## Installation

### Load and Test the Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle in the top right corner.
3. Click "Load unpacked" and select your extension's directory.

## Usage
1. Click on the extension icon to open the popup.
2. Enter your custom HTML content in the provided textarea.
3. Click the "Inject HTML" button to inject the HTML into the active Gmail compose window.

## Files

### `manifest.json`
Defines the extension's metadata and permissions.

```json
{
  "manifest_version": 3,
  "name": "Gmail HTML Injector",
  "version": "1.0",
  "description": "Inject custom HTML into Gmail compose window.",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["https://mail.google.com/*"],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["https://mail.google.com/*"],
      "js": ["content.js"]
    }
  ]
}
```

### `popup.html`
HTML file for the popup interface.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Gmail HTML Injector</title>
  <style>
    body {
      width: 300px;
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    textarea {
      width: 90%;
      height: 150px;
      margin-bottom: 10px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <textarea id="htmlContent" placeholder="Enter HTML content"></textarea>
  <button id="injectHtml">Inject HTML</button>
  <script src="popup.js"></script>
</body>
</html>

```

### `popup.js`
JavaScript file to handle the popup's behavior.

```javascript
document.getElementById('injectHtml').addEventListener('click', () => {
  const htmlContent = document.getElementById('htmlContent').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: 'injectHtml', htmlContent: htmlContent }, (response) => {
      console.log(response.status);
    });
  });
});
```

### `background.js`
Background script (currently not used but required to exist).

```javascript
// No background script is necessary for this basic functionality, but the file must exist
```

### `content.js`
Content script to inject HTML into the Gmail compose window.

```javascript
function injectHtml(htmlContent) {
  const selectors = [
    'div[aria-label="Message Body"]', 
    '.Am.Al.editable.LW-avf'
  ];

  let composeElement = null;

  for (let selector of selectors) {
    composeElement = document.querySelector(selector);
    if (composeElement) break;
  }

  console.log('Compose element found:', composeElement ? 'Yes' : 'No');

  if (composeElement) {
    console.log('Injecting HTML content...');
    composeElement.innerHTML = htmlContent;  // Replace the entire content
  } else {
    console.log('No compose element found.');
  }
}

function tryInjectHtml(htmlContent, attempts = 5) {
  if (attempts === 0) return;

  setTimeout(() => {
    injectHtml(htmlContent);

    if (!document.querySelector('div[aria-label="Message Body"], .Am.Al.editable.LW-avf')) {
      console.log('Retrying to find compose element...');
      tryInjectHtml(htmlContent, attempts - 1);
    }
  }, 500); // Retry after 500ms
}

// Add a listener for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectHtml' && request.htmlContent) {
    console.log('Received request to inject HTML');
    tryInjectHtml(request.htmlContent);
    sendResponse({ status: 'HTML injection attempt made' });
  }
});
```

## Contributing
Feel free to fork this repository and submit pull requests. We welcome contributions to improve this extension.

## License
This project is licensed under the MIT License.
