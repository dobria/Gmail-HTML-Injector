document.getElementById('injectHtml').addEventListener('click', () => {
  const htmlContent = document.getElementById('htmlContent').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: 'injectHtml', htmlContent: htmlContent }, (response) => {
      console.log(response.status);
    });
  });
});
