class TextFittingTool {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.displayArea = document.getElementById('displayArea');
        this.textDisplay = document.getElementById('textDisplay'); // This might be redundant if not used directly
        this.layoutMode = document.getElementById('layoutMode');
        this.fontSize = document.getElementById('fontSize');
        this.columnCount = document.getElementById('columnCount');
        this.lineHeight = document.getElementById('lineHeight');
        this.zoomLevel = 100;
        
        this.initializeEventListeners();
        this.updateDisplay();
        this.updateStats();
    }

    initializeEventListeners() {
        this.textInput.addEventListener('input', () => {
            this.updateDisplay();
            this.updateStats();
        });

        this.layoutMode.addEventListener('change', () => this.updateDisplay());
        
        this.fontSize.addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            this.updateDisplay();
        });

        this.columnCount.addEventListener('input', (e) => {
            document.getElementById('columnValue').textContent = e.target.value;
            this.updateDisplay();
        });

        this.lineHeight.addEventListener('input', (e) => {
            document.getElementById('lineHeightValue').textContent = e.target.value;
            this.updateDisplay();
        });

        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoomLevel = Math.min(200, this.zoomLevel + 10);
            this.updateZoom();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoomLevel = Math.max(50, this.zoomLevel - 10);
            this.updateZoom();
        });

        document.getElementById('fitText').addEventListener('click', () => this.autoFit());
        document.getElementById('resetView').addEventListener('click', () => this.resetView());
        document.getElementById('nativeFullScreenBtn').addEventListener('click', () => this.toggleNativeFullscreen());
        document.getElementById('downloadImageBtn').addEventListener('click', () => this.downloadAsImage());
    }
    
    toggleNativeFullscreen() {
        if (!document.fullscreenElement) {
            this.displayArea.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        // No need to call updateDisplay() here as the browser handles the element's display
    }

    updateDisplay() {
        const text = this.textInput.value;
        const mode = this.layoutMode.value;
        const fontSize = this.fontSize.value + 'px';
        const lineHeight = this.lineHeight.value;
        const columns = this.columnCount.value;

        // Always render to displayArea
        const targetContainer = this.displayArea;

        targetContainer.innerHTML = ''; // Clear previous content

        const baseStyle = `
            font-size: ${fontSize};
            line-height: ${lineHeight};
            transform: scale(${this.zoomLevel / 100});
            transform-origin: top left;
            overflow-x: hidden; /* Applied to all views */
            word-wrap: break-word; /* Applied to all views */
            word-break: break-word; /* Applied to all views */
            height: 100%; /* Ensure views take full height of container */
        `;

        switch (mode) {
            case 'single':
                this.createSingleView(text, baseStyle, targetContainer);
                break;
            case 'split-vertical':
                this.createSplitView(text, baseStyle, 'vertical', targetContainer);
                break;
            case 'split-horizontal':
                this.createSplitView(text, baseStyle, 'horizontal', targetContainer);
                break;
            case 'split-quad':
                this.createSplitView(text, baseStyle, 'quad', targetContainer);
                break;
            case 'columns':
                this.createColumnView(text, baseStyle, columns, targetContainer);
                break;
            case 'scroll':
                this.createScrollView(text, baseStyle, targetContainer);
                break;
            case 'compact':
                this.createCompactView(text, baseStyle, targetContainer);
                break;
        }
    }

    createSingleView(text, style, container) {
        const div = document.createElement('div');
        div.className = 'text-display'; // Existing class for single view specific styles
        div.style.cssText = style;
        div.textContent = text;
        container.appendChild(div);
    }

    createSplitView(text, style, direction, container) {
        const containerDiv = document.createElement('div');
        containerDiv.className = `split-view split-${direction}`;
        // Base style already includes height: 100%
        // containerDiv.style.height = '100%'; // Already in baseStyle or handled by .split-view
        
        const sentences = text.split(/(?<=[.!?])\s+/);
        const numPanels = direction === 'quad' ? 4 : 2;
        const chunks = this.splitIntoChunks(sentences, numPanels);
        
        chunks.forEach((chunk) => {
            const panel = document.createElement('div');
            panel.className = 'panel';
            // Added overflow-x: hidden and word-wrap/break from baseStyle to panel specific style
            panel.style.cssText = style + 'overflow-y: auto;'; // style already contains common properties
            
            const panelText = chunk.join(' ').trim();
            if (panelText) {
                panel.textContent = panelText;
            } else {
                panel.textContent = '(continued...)';
                panel.style.color = '#999';
                panel.style.fontStyle = 'italic';
            }
            containerDiv.appendChild(panel);
        });
        container.appendChild(containerDiv);
    }

    createColumnView(text, style, columns, container) {
        const div = document.createElement('div');
        div.className = 'column-view'; // Existing class for column view specific styles
        div.style.cssText = style + `column-count: ${columns};`;
        div.textContent = text;
        container.appendChild(div);
    }

    createScrollView(text, style, container) {
        const containerDiv = document.createElement('div');
        containerDiv.className = 'scroll-view'; // Existing class for scroll view specific styles
        // containerDiv.style.cssText = style; // Apply base style to the container itself if needed
        
        const content = document.createElement('div');
        content.className = 'scroll-content';
        content.style.cssText = style; // Apply base style to the content for font, zoom etc.
        content.textContent = text;
        
        containerDiv.appendChild(content);
        container.appendChild(containerDiv);
    }

    createCompactView(text, style, container) {
        const div = document.createElement('div');
        div.className = 'compact-view'; // Existing class for compact view specific styles
        div.style.cssText = style; // Apply base style
        div.textContent = text;
        container.appendChild(div);
    }

    splitIntoChunks(items, numChunks) {
        const chunks = [];
        if (items.length === 0) { // Handle empty input to avoid NaN issues
            for (let i = 0; i < numChunks; i++) chunks.push([]);
            return chunks;
        }
        const itemsPerChunk = Math.ceil(items.length / numChunks);
        
        for (let i = 0; i < numChunks; i++) {
            const start = i * itemsPerChunk;
            const end = Math.min(start + itemsPerChunk, items.length);
            chunks.push(items.slice(start, end));
        }
        
        while (chunks.length < numChunks) {
            chunks.push([]);
        }
        return chunks;
    }

    updateZoom() {
        document.getElementById('zoomLevel').textContent = this.zoomLevel + '%';
        this.updateDisplay();
    }

    autoFit() {
        const text = this.textInput.value;
        const textLength = text.length;
        
        if (textLength < 500) {
            this.layoutMode.value = 'single';
            this.fontSize.value = 16;
        } else if (textLength < 2000) {
            this.layoutMode.value = 'columns';
            this.fontSize.value = 12;
            this.columnCount.value = 2;
        } else if (textLength < 5000) {
            this.layoutMode.value = 'split-vertical';
            this.fontSize.value = 10;
        } else {
            this.layoutMode.value = 'split-quad';
            this.fontSize.value = 8; // Slightly increased for readability
        }
        
        this.lineHeight.value = 1.4; // Adjusted for better general readability
        this.zoomLevel = 100;
        
        document.getElementById('fontSizeValue').textContent = this.fontSize.value + 'px';
        document.getElementById('columnValue').textContent = this.columnCount.value;
        document.getElementById('lineHeightValue').textContent = this.lineHeight.value;
        document.getElementById('zoomLevel').textContent = this.zoomLevel + '%'; // Ensure zoom level display updates
        
        this.updateDisplay();
    }

    resetView() {
        this.layoutMode.value = 'single';
        this.fontSize.value = 14;
        this.columnCount.value = 2;
        this.lineHeight.value = 1.6;
        this.zoomLevel = 100;
        
        document.getElementById('fontSizeValue').textContent = '14px';
        document.getElementById('columnValue').textContent = '2';
        document.getElementById('lineHeightValue').textContent = '1.6';
        document.getElementById('zoomLevel').textContent = '100%';
        
        this.updateDisplay();
    }

    updateStats() {
        const text = this.textInput.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text.split('\n').length; // This counts empty lines as well
        const readingTime = Math.ceil(words / 200); 
        
        document.getElementById('charCount').textContent = chars.toLocaleString();
        document.getElementById('wordCount').textContent = words.toLocaleString();
        document.getElementById('lineCount').textContent = lines.toLocaleString();
        document.getElementById('readingTime').textContent = readingTime + ' min';
    }

    downloadAsImage() {
        const targetElement = this.displayArea.firstChild;

        if (!targetElement) {
            alert('No content to capture. Please type some text.');
            return;
        }

        // Store original styles
        const originalStyles = {
            display: targetElement.style.display,
            width: targetElement.style.width,
            height: targetElement.style.height,
            overflow: targetElement.style.overflow,
            backgroundColor: targetElement.style.backgroundColor,
            padding: targetElement.style.padding,
            transform: targetElement.style.transform, // Store original transform
            transformOrigin: targetElement.style.transformOrigin // Store original transform-origin
        };

        // Temporarily change styles for tight capture
        targetElement.style.transform = 'none'; // Remove transform for measurement
        targetElement.style.transformOrigin = 'initial'; // Reset transform-origin
        targetElement.style.display = 'inline-block';
        targetElement.style.width = 'auto';
        targetElement.style.height = 'auto';
        targetElement.style.padding = '0px';
        targetElement.style.overflow = 'visible';
        targetElement.style.backgroundColor = originalStyles.backgroundColor || '#191928';

        // Force browser to recalculate styles
        void targetElement.offsetHeight; // Triggers reflow

        const unscaledWidth = targetElement.offsetWidth;
        const unscaledHeight = targetElement.offsetHeight;
        const canvasBackgroundColor = '#191928';
        const currentZoomFactor = this.zoomLevel / 100;

        html2canvas(targetElement, {
            useCORS: true,
            backgroundColor: canvasBackgroundColor,
            scale: currentZoomFactor, // Apply scaling via html2canvas
            width: unscaledWidth,    // Use unscaled width for canvas base
            height: unscaledHeight,  // Use unscaled height for canvas base
            windowWidth: unscaledWidth,
            windowHeight: unscaledHeight
        }).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'token-canvas-optimizer-output.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('Error generating image. See console for details.');
        }).finally(() => {
            // Restore original styles regardless of success or failure
            targetElement.style.display = originalStyles.display;
            targetElement.style.width = originalStyles.width;
            targetElement.style.height = originalStyles.height;
            targetElement.style.overflow = originalStyles.overflow;
            targetElement.style.backgroundColor = originalStyles.backgroundColor;
            targetElement.style.padding = originalStyles.padding;
            targetElement.style.transform = originalStyles.transform; // Restore transform
            targetElement.style.transformOrigin = originalStyles.transformOrigin; // Restore transform-origin
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TextFittingTool();
}); 