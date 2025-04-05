const box1 = document.querySelector('#box1');
const inputBox = document.querySelector("#input");
const generateBtn = document.querySelector("#submit-btn");
const outputBox = document.querySelector("#url-output");
const box2 = document.querySelector('#box2');
const copyBtn = document.querySelector("#copy-btn");
const resetBtn = document.querySelector("#reset-btn");

// Input Validation
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Generate short URL via backend API
async function generateShortUrl() {
    let longUrl = inputBox.value.trim();

    // Validation
    if (longUrl === "") {
        alert("Please enter a URL first!");
        return;
    }
    if (!isValidUrl(longUrl)) {
        alert("Please enter a valid URL!");
        return;
    }

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl })
        });

        const data = await response.json();
        if (response.ok) {
            box1.classList.add('hidden');
            box2.classList.remove('hidden');
            outputBox.innerText = `${window.location.origin}/${data.shortKey}`;
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error generating short URL:", error);
        alert("Failed to generate short URL. Please try again.");
    }
}

// Copy short URL to clipboard
copyBtn.addEventListener("click", () => {
    let url = outputBox.innerText;
    navigator.clipboard.writeText(url).then(() => {
        alert("URL copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy to clipboard: " + err);
    });
});

// Reset input fields
resetBtn.addEventListener("click", () => {
    box2.classList.add("hidden");
    box1.classList.remove('hidden');
    inputBox.value = "";
    outputBox.innerText = "";
});

// Add event listener to the generate button
generateBtn.addEventListener("click", generateShortUrl);
