function injectHtml(htmlContent) {
  const composeElements = document.querySelectorAll('div[aria-label="Message Body"]');
  console.log('Compose elements found:', composeElements.length);
  if (composeElements.length > 0) {
    const composeElement = composeElements[0];
    console.log('Injecting HTML content...');
    composeElement.innerHTML = htmlContent;  // Replace the entire content
  } else {
    console.log('No compose element found.');
  }
}

// Add a listener for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectHtml' && request.htmlContent) {
    console.log('Received request to inject HTML');
    injectHtml(request.htmlContent);
    sendResponse({ status: 'HTML injected' });
  }
});
