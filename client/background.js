chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchSuggestions") {
        fetch(`https://www.startpage.com/osuggestions?q=${encodeURIComponent(request.query)}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // Startpage returns [query, [suggestions...]]
                sendResponse({ success: true, data: data[1] || [] });
            })
            .catch(error => {
                console.error("Error fetching suggestions:", error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Will respond asynchronously
    }
});
