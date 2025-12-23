// DOM elements
const inputArea = document.getElementById('input');
const outputArea = document.getElementById('output');
const cleanButton = document.getElementById('cleanButton');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clearButton');
const removeEmptyLinesCheckbox = document.getElementById('removeEmptyLines');
const showHtmlCheckbox = document.getElementById('showHtml');
const inputHtmlView = document.getElementById('inputHtmlView');
const outputHtmlView = document.getElementById('outputHtmlView');
const inputTabs = document.getElementById('inputTabs');
const outputTabs = document.getElementById('outputTabs');

// Clean formatting function
function cleanFormatting() {
    // Get the HTML content from the input area
    const inputHTML = inputArea.innerHTML;
    
    if (!inputHTML.trim()) {
        alert('¡Por favor pegá contenido primero!');
        return;
    }
    
    // Create a temporary div to parse and clean the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = inputHTML;
    
    // Remove specific Google Docs artifacts and unwanted styling
    cleanGoogleDocsFormatting(tempDiv);
    
    // Remove empty lines between paragraphs if checkbox is checked
    if (removeEmptyLinesCheckbox.checked) {
        removeEmptyLinesBetweenParagraphs(tempDiv);
    }
    
    // Get the cleaned HTML
    let cleanedHTML = tempDiv.innerHTML;
    
    // Decode common HTML entities to their corresponding characters
    // Note: &amp; must be replaced last to avoid double-decoding
    cleanedHTML = cleanedHTML.replace(/&nbsp;/g, ' ');
    cleanedHTML = cleanedHTML.replace(/&lt;/g, '<');
    cleanedHTML = cleanedHTML.replace(/&gt;/g, '>');
    cleanedHTML = cleanedHTML.replace(/&quot;/g, '"');
    cleanedHTML = cleanedHTML.replace(/&#39;/g, "'");
    cleanedHTML = cleanedHTML.replace(/&amp;/g, '&');
    
    // Set the output
    outputArea.innerHTML = cleanedHTML;
    
    // Update HTML views if visible
    updateHtmlViews();
    
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
            
            // Check for inline styles BEFORE removing them
            const computedStyle = window.getComputedStyle(element);
            const fontWeight = element.style.fontWeight || computedStyle.fontWeight;
            const isBold = fontWeight === 'bold' || 
                          parseInt(fontWeight) >= 600;
            const isItalic = element.style.fontStyle === 'italic' || 
                           computedStyle.fontStyle === 'italic';
            const isUnderline = element.style.textDecoration?.includes('underline') ||
                              computedStyle.textDecoration?.includes('underline');
            
            // Remove all inline styles
            element.removeAttribute('style');
            
            // Remove Google Docs specific attributes
            element.removeAttribute('id');
            element.removeAttribute('class');
            element.removeAttribute('dir');
            
            // Handle spans - convert to semantic tags if they have formatting
            if (element.tagName === 'SPAN') {
                const hasFormattingChildren = element.querySelector('b, strong, i, em, u, a');
                
                if (isBold && !hasFormattingChildren) {
                    // Convert to strong
                    const strong = document.createElement('strong');
                    while (element.firstChild) {
                        strong.appendChild(element.firstChild);
                    }
                    element.parentNode.replaceChild(strong, element);
                    processElement(strong);
                    return;
                } else if (isItalic && !hasFormattingChildren) {
                    // Convert to em
                    const em = document.createElement('em');
                    while (element.firstChild) {
                        em.appendChild(element.firstChild);
                    }
                    element.parentNode.replaceChild(em, element);
                    processElement(em);
                    return;
                } else if (isUnderline && !hasFormattingChildren) {
                    // Convert to u
                    const u = document.createElement('u');
                    while (element.firstChild) {
                        u.appendChild(element.firstChild);
                    }
                    element.parentNode.replaceChild(u, element);
                    processElement(u);
                    return;
                } else if (!hasFormattingChildren && !isBold && !isItalic && !isUnderline) {
                    // Unwrap the span if it has no formatting
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
            
            // Keep only essential tags: p, br, strong, em, u, a, ul, ol, li, h1-h6, blockquote
            const allowedTags = ['P', 'BR', 'STRONG', 'EM', 'U', 'A', 'UL', 'OL', 'LI', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'];
            
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

function removeEmptyLinesBetweenParagraphs(parent) {
    // Find all <br> elements that appear between closing and opening <p> tags
    // This handles patterns like </p><br><p> or </p> <br> <p>
    const allBrNodes = Array.from(parent.querySelectorAll('br'));
    
    allBrNodes.forEach(node => {
        // Find previous and next element siblings, skipping text nodes
        let prev = node.previousSibling;
        while (prev && prev.nodeType === Node.TEXT_NODE && prev.textContent.trim() === '') {
            prev = prev.previousSibling;
        }
        
        let next = node.nextSibling;
        while (next && next.nodeType === Node.TEXT_NODE && next.textContent.trim() === '') {
            next = next.nextSibling;
        }
        
        // Remove <br> if it's between two paragraphs
        if (prev && next && prev.nodeType === Node.ELEMENT_NODE && next.nodeType === Node.ELEMENT_NODE &&
            prev.tagName === 'P' && next.tagName === 'P') {
            node.remove();
        }
    });
    
    // Also handle <br> inside paragraphs that are alone
    const paragraphs = parent.querySelectorAll('p');
    paragraphs.forEach(p => {
        // If paragraph only contains a <br> and whitespace, remove the <br>
        const children = Array.from(p.childNodes);
        const hasOnlyBr = children.every(child => {
            if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'BR') return true;
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '') return true;
            return false;
        });
        
        if (hasOnlyBr && children.some(child => child.tagName === 'BR')) {
            p.querySelectorAll('br').forEach(br => br.remove());
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
            showFeedback('¡Copiado al portapapeles!');
        } catch (err) {
            // Fallback to plain text if HTML copy fails
            await navigator.clipboard.writeText(plainText);
            showFeedback('¡Copiado como texto plano!');
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
        // Using deprecated execCommand as a fallback for older browsers
        // that don't support the Clipboard API
        document.execCommand('copy');
        showFeedback('¡Copiado al portapapeles!');
    } catch (err) {
        alert('Error al copiar. Por favor seleccioná y copiá manualmente.');
    }
    
    selection.removeAllRanges();
}

function showFeedback(message) {
    const originalText = copyButton.textContent;
    copyButton.textContent = message;
    copyButton.style.background = '#F95755';
    
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.background = '';
    }, 2000);
}

function clearAll() {
    inputArea.innerHTML = '';
    outputArea.innerHTML = '';
    inputHtmlView.value = '';
    outputHtmlView.value = '';
    copyButton.disabled = true;
}

// HTML view functionality
function updateHtmlViews() {
    inputHtmlView.value = inputArea.innerHTML;
    outputHtmlView.value = outputArea.innerHTML;
}

function toggleHtmlView() {
    const showHtml = showHtmlCheckbox.checked;
    
    if (showHtml) {
        inputTabs.style.display = 'flex';
        outputTabs.style.display = 'flex';
        updateHtmlViews();
    } else {
        inputTabs.style.display = 'none';
        outputTabs.style.display = 'none';
        // Reset to visual tabs
        switchTab('input-visual', inputTabs);
        switchTab('output-visual', outputTabs);
    }
}

function switchTab(tabId, tabsContainer) {
    // Hide all tab contents in the relevant section
    const section = tabsContainer.parentElement;
    const tabContents = section.querySelectorAll('.tab-content');
    const tabButtons = tabsContainer.querySelectorAll('.tab-button');
    
    tabContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.classList.add('active');
    }
    
    // Activate the button
    const activeButton = tabsContainer.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Update HTML views when input changes
inputArea.addEventListener('input', () => {
    if (showHtmlCheckbox.checked) {
        updateHtmlViews();
    }
});

// Event listeners
cleanButton.addEventListener('click', cleanFormatting);
copyButton.addEventListener('click', copyToClipboard);
clearButton.addEventListener('click', clearAll);
showHtmlCheckbox.addEventListener('change', toggleHtmlView);

// Tab switching
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-button')) {
        const tabId = e.target.getAttribute('data-tab');
        const tabsContainer = e.target.closest('.tabs');
        switchTab(tabId, tabsContainer);
    }
});

// Allow Enter key to trigger cleaning
inputArea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        cleanFormatting();
    }
});
