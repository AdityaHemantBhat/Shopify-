export const apiFetch = async (url, options) => {
  if (options == undefined) {
    options = {};
  }

  if (options.headers == undefined) {
    options.headers = {};
  }

  options.headers["Content-Type"] = "application/json";

  const response = await fetch(url, options);

  checkForReauthorization(response);

  return response;
}

const checkForReauthorization = (response) => {
  const authHeader = response.headers.get("X-Shopify-API-Request-Failure-Reauthorize");
  
  if (authHeader == "1") {
    console.log("auth header is 1");
    const authUrlHeader = response.headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url");
    
    if (authUrlHeader != null && authUrlHeader != undefined && authUrlHeader != "") {
      console.log("redirecting to: " + authUrlHeader);
      window.open(authUrlHeader, "_top");
    }
  }
}
