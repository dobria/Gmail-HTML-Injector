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
