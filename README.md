# 🔧 Canvas Token Optimizer: LLM Prompt Engineering & Visualization

Canvas Token Optimizer is a specialized web utility for AI Red Teamers and Prompt Engineers. It empowers you to craft, refine, and visualize text for Large Language Model (LLM) inputs, focusing on maximizing token efficiency and generating compact image representations of your prompts.

## ✨ Key Features

### 📝 **Advanced Text Manipulation & Layouts**
-   **Compact View**: Crucial for token efficiency! Minimizes line height and font size for the densest text display, ideal for creating token-frugal images of prompts.
-   **Versatile Layouts (Single, Split-Vertical/Horizontal/Quad, Multi-Column, Scroll)**: Organize complex prompts, compare versions, or structure text for analysis before image generation.

### 🎛️ **Precision Display Controls**
-   **Font Size & Line Height**: Fine-tune for optimal density and visual clarity.
-   **Zoom Functionality**: Scale the view (50%-200%) for detailed inspection.
-   **Auto Fit**: Intelligently suggests layouts, adaptable for quick optimization.
-   **Native Fullscreen**: Distraction-free environment for focused work.

### 📊 **Real-time Prompt Statistics**
-   **Character Count**: Essential for monitoring prompt length against token limits.
-   **Word & Line Count**: Additional metrics for text assessment.

### 🖼️ **Direct Image Generation (Coming Soon in Beta)**
-   The ability to directly download the optimized text view as a PNG or JPEG image, eliminating manual screenshotting.

### 🎨 **Streamlined UI**
-   Modern dark theme for comfortable extended use.
-   Responsive design for accessibility across devices.

## 🚀 Live Demo
Visit the live demo: [Canvas Token Optimizer](https://karthidreamr.github.io/Canvas-Token-Optimizer)

## 🛠️ How to Use for Optimal Prompt Engineering

1.  **Input Text**: Paste or type your LLM prompt, code, or data.
2.  **Select Layout**: "Compact View" is often preferred for generating token-efficient images. Use other layouts for structuring or comparison.
3.  **Optimize Display**:
    *   Minimize "Font Size" and "Line Height" for the highest text density.
    *   Adjust "Columns" or "Zoom" as needed.
4.  **Analyze Stats**: Keep an eye on "Character Count" to stay within token budgets.
5.  **Generate Image (Beta Feature)**: Use the upcoming "Download Image" feature to get a clean image of your optimized prompt. (Currently: take a manual screenshot).

## 💡 Use Cases for AI Red Teaming & LLM Development

-   **Token-Efficient Visual Prompts**: Create compact images of prompts for documentation, sharing, or when direct text input is restricted.
-   **Jailbreak & Exploit Design**: Visually lay out and refine complex jailbreak prompts, then capture them as images.
-   **Comparative Prompt Analysis**: Use split views to compare prompt variations, then image the chosen one.
-   **Payload Crafting & Visualization**: Design and view compact payloads for LLM vulnerability testing.
-   **Educational Material**: Generate clear visual examples of prompts and LLM interactions.

## 🔧 Technical Stack
-   HTML5, CSS3 (Flexbox, Grid)
-   Vanilla JavaScript (ES6+)
-   (Planned for image generation: `html2canvas` or similar library)

## 🌟 Planned Enhancements & Roadmap

-   [X] **Direct Image Download**: Core feature for next release (Beta branch).
-   [ ] Customizable image output settings (format, quality).
-   [ ] Export to PDF/Text.
-   [ ] Save/Load prompt sessions locally.
-   [ ] Advanced token counting (e.g., BPE approximation).

---

Crafted for precision in AI Red Teaming and advanced Prompt Engineering.
