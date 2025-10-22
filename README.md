# Create Custom Forms in Seconds with the Dynamic Form Generator

Ever wanted to create a form but didn't want to mess with complicated code? The Dynamic Form Generator is a user-friendly tool that lets you build custom forms for any purpose, from simple contact forms to complex surveys, all without writing a single line of code.

![Dynamic Form Generator Screenshot](https://i.imgur.com/your-screenshot.png)  <!-- Replace with your screenshot -->

## Key Features

*   **AI-Powered Form Generation:** Describe your desired form in natural language, and our AI will instantly generate a JSON schema for you.
*   **Intuitive UI Editor:** Visually design your forms with a powerful UI editor. Add, remove, and configure fields with ease.
*   **Advanced Layout Editor (WYSIWYG):** Precisely control the layout of your form fields with a new Canvas-based editor. Drag and drop fields, resize them, and arrange them in a grid-based system with real-time visual feedback.
*   **Comprehensive Styling Options:** Customize the look and feel of your forms with extensive theme properties, including fonts, colors, spacing, and borders.
*   **Instant Previews:** See your form come to life as you build it. The live preview panel shows you exactly what your form will look like.
*   **Custom Field Types:** Beyond standard text and numbers, create forms with rich text editors, file uploads, and custom buttons.
*   **Conditional Logic:** Implement dynamic forms where fields appear or disappear based on user input.
*   **Robust Code Generation:** Generate production-ready, responsive, and accessible code for various web frameworks (e.g., React, Vue) and UI libraries (e.g., Tailwind CSS, Material-UI) based on your schema. The generated code includes form state management and validation.

## How to Use

1.  **Describe Your Form (AI Editor):** Start by typing a description of the form you want to create in the **AI Editor** tab. For example, "a customer feedback form with a rating scale from 1 to 5."
2.  **Visually Design (UI Editor):** Switch to the **UI Editor** tab to add, remove, or configure fields. Use the **Edit Layout** button to access the advanced Canvas-based layout editor for precise positioning and resizing.
3.  **Preview Your Form:** The **Form Preview** panel will update in real-time, showing you exactly what your form looks like.
4.  **Generate Code:** In the **Generated Code** panel, select your desired framework and UI library. Click the **Generate Code** button, then **View Generated Code** to see the output in a modal with separate files and copy options.

## Examples of What You Can Create

*   Contact forms
*   Surveys and questionnaires
*   Event registration forms
*   Job application forms
*   Customer feedback forms
*   And much more!

## For Developers

<details>
<summary>Click to expand for technical details</summary>

This project was built with the following technologies:

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Material-UI:** A React UI framework that implements Google's Material Design.
*   **Vite:** A build tool that provides a fast development experience for modern web projects.
*   **Zod:** A TypeScript-first schema declaration and validation library.
*   **@google/generative-ai:** The Google Generative AI SDK for TypeScript.
*   **jodit-react:** A React wrapper for the Jodit editor.
*   **Vitest:** A blazing fast unit-test framework powered by Vite.
*   **react-resizable-panels:** A library for creating resizable panels in React.
*   **konva & react-konva:** Libraries for 2D canvas rendering in React.
*   **Code Generation Module:** A new module (`src/code-generator`) responsible for programmatically generating production-ready form code based on user-defined schemas and selected tech stacks.

### Getting Started

To get started with the project, you need to have Node.js and npm installed on your machine.

1.  Clone the repository:

```bash
git clone https://github.com/your-username/dynamic-form-generator.git
```

2.  Create a `.env` file in the root of the project and add your Gemini API key as `VITE_GEMINI_API_KEY`.

3.  Install the dependencies:

```bash
npm install
```

4.  Start the development server:

```bash
npm run dev
```

This will start the development server on `http://localhost:5173`.

5.  Run the tests:

```bash
npm test
```

</details>