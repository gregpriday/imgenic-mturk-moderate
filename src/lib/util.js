let generateCloudFlareUrl = (src, options = {}) => {
    // Default options
    let defaultOptions = {
        format: 'auto'
    };

    // Merge default options with input options
    let mergedOptions = { ...defaultOptions, ...options };

    // Convert the options object into a query string
    let optQueryString = Object.keys(mergedOptions).map(key => `${key}=${mergedOptions[key]}`).join(',');

    // Construct the URL
    let imageUrl = new URL(src);
    let host = imageUrl.host;
    let path = imageUrl.pathname;
    return `https://${host}/cdn-cgi/image/${optQueryString}${path}`;
};

// Export
export { generateCloudFlareUrl };