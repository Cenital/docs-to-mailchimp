// DOM elements
const inputArea = document.getElementById('input');
const outputArea = document.getElementById('output');
const cleanButton = document.getElementById('cleanButton');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clearButton');

// Clean formatting function
function cleanFormatting() {
    // Get the HTML content from the input area
    const inputHTML = inputArea.innerHTML;
    
    if (!inputHTML.trim() || inputHTML.trim() === '') {
        alert('Please paste some content first!');
        return;
    }
    
    // Create a temporary div to parse and clean the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = inputHTML;
    
    // Remove specific Google Docs artifacts and unwanted styling
    cleanGoogleDocsFormatting(tempDiv);
    
    // Get the cleaned HTML
    const cleanedHTML = tempDiv.innerHTML;
    
    // Set the output
    outputArea.innerHTML = cleanedHTML;
    
    // Enable copy button
    copyButton.disabled = false;
}

function cleanGoogleDocsFormatting(element) {
    // Remove Google Docs specific elements and IDs
    const elementsToRemove = element.querySelectorAll('[id^="docs-"], .c, .lst-');
    elementsToRemove.forEach(el => {
        // Move children out before removing the element
        while (el.firstChild) {
            el.parentNode.insertBefore(el.firstChild, el);
        }
        el.remove();
    });
    
    // Process all elements recursively
    processElement(element);
    
    // Remove empty elements
    removeEmptyElements(element);
}

function processElement(parent) {
    const children = Array.from(parent.childNodes);
    
    children.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            
            // Remove all inline styles
            element.removeAttribute('style');
            
            // Remove Google Docs specific attributes
            element.removeAttribute('id');
            element.removeAttribute('class');
            element.removeAttribute('dir');
            
            // Handle spans - unwrap unless they contain formatting
            if (element.tagName === 'SPAN') {
                const hasFormatting = element.querySelector('b, strong, i, em, u, a');
                const isFormatted = element.style.fontWeight === 'bold' || 
                                  element.style.fontStyle === 'italic' ||
                                  element.style.textDecoration === 'underline';
                
                if (!hasFormatting && !isFormatted) {
                    // Unwrap the span
                    while (element.firstChild) {
                        element.parentNode.insertBefore(element.firstChild, element);
                    }
                    element.remove();
                    return; // Skip processing children since we moved them
                }
            }
            
            // Normalize bold tags
            if (element.tagName === 'B' || element.tagName === 'STRONG') {
                const newElement = document.createElement('strong');
                while (element.firstChild) {
                    newElement.appendChild(element.firstChild);
                }
                element.parentNode.replaceChild(newElement, element);
                processElement(newElement);
                return;
            }
            
            // Normalize italic tags
            if (element.tagName === 'I' || element.tagName === 'EM') {
                const newElement = document.createElement('em');
                while (element.firstChild) {
                    newElement.appendChild(element.firstChild);
                }
                element.parentNode.replaceChild(newElement, element);
                processElement(newElement);
                return;
            }
            
            // Keep only essential tags: p, br, strong, em, u, a, ul, ol, li
            const allowedTags = ['P', 'BR', 'STRONG', 'EM', 'U', 'A', 'UL', 'OL', 'LI', 'DIV'];
            
            if (!allowedTags.includes(element.tagName)) {
                // For other tags, unwrap them but keep content
                while (element.firstChild) {
                    element.parentNode.insertBefore(element.firstChild, element);
                }
                element.remove();
                return;
            }
            
            // Clean anchor tags - keep only href
            if (element.tagName === 'A') {
                const href = element.getAttribute('href');
                // Remove all attributes
                const attrs = Array.from(element.attributes);
                attrs.forEach(attr => element.removeAttribute(attr.name));
                // Restore only href
                if (href) {
                    element.setAttribute('href', href);
                }
            }
            
            // Recursively process children
            processElement(element);
        }
    });
}

function removeEmptyElements(parent) {
    const elements = Array.from(parent.querySelectorAll('*'));
    
    elements.forEach(element => {
        // Don't remove br tags or elements with text content
        if (element.tagName === 'BR') return;
        
        const hasText = element.textContent.trim().length > 0;
        const hasImportantChildren = element.querySelector('br, img');
        
        if (!hasText && !hasImportantChildren) {
            element.remove();
        }
    });
}

// Copy to clipboard function
async function copyToClipboard() {
    try {
        // Get the HTML content
        const htmlContent = outputArea.innerHTML;
        
        // Create a ClipboardItem with both HTML and plain text
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const plainText = outputArea.innerText;
        
        // Try to copy as HTML first
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': blob,
                    'text/plain': new Blob([plainText], { type: 'text/plain' })
                })
            ]);
            showFeedback('Copied to clipboard!');
        } catch (err) {
            // Fallback to plain text if HTML copy fails
            await navigator.clipboard.writeText(plainText);
            showFeedback('Copied as plain text!');
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback to old method
        fallbackCopy();
    }
}

function fallbackCopy() {
    const range = document.createRange();
    range.selectNodeContents(outputArea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    try {
        document.execCommand('copy');
        showFeedback('Copied to clipboard!');
    } catch (err) {
        alert('Failed to copy. Please select and copy manually.');
    }
    
    selection.removeAllRanges();
}

function showFeedback(message) {
    const originalText = copyButton.textContent;
    copyButton.textContent = message;
    copyButton.style.background = '#059669';
    
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.background = '';
    }, 2000);
}

function clearAll() {
    inputArea.innerHTML = '';
    outputArea.innerHTML = '';
    copyButton.disabled = true;
}

// Event listeners
cleanButton.addEventListener('click', cleanFormatting);
copyButton.addEventListener('click', copyToClipboard);
clearButton.addEventListener('click', clearAll);

// Allow Enter key to trigger cleaning
inputArea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        cleanFormatting();
    }
});
