// Timeout for http call
const timeout = 8000;

// Default quote in case the API is not available.
let quote = {
  content: "I did a dangerous thing for a man in my position: I decided to tell the truth. 📡",
  author: "Edward Snowden"
}

// Get current website name
const canonicalURL = location.protocol + "//" + location.host
console.log("Detected website name " + canonicalURL);

try {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(canonicalURL + "/api/getQuote", {signal: controller.signal});
  clearTimeout(id);

  // Check if the API is available and default to a static quote if not.
  if (response.ok) {
    const data = await response.json();
    quote = {
      content: data.content,
      author: data.author
    }
  }
} catch (error) {
  console.error("Failed to fetch quote from API: " + error);
}

document.getElementById("quote-text").innerText = quote.content;
document.getElementById("quote-author").innerText = quote.author;
document.getElementById("quote-loader").remove();
document.getElementById("quote").style.display = "block";