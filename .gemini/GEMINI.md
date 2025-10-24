# Project: Dynamic Form Generator

## 1. Overview

This project is a web-based application that allows users to dynamically generate forms from a JSON schema. The application has three main components:

*   **Schema Editor:** A component that allows users to create and edit the JSON schema for the form.
*   **Form Renderer:** A component that renders the form based on the JSON schema.
*   **Output Panel:** A component that displays the form data and any validation errors.

## 2. Architecture

The application is built using the following technologies:

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
*   **AI-Driven Code Generation:** The core code generation logic is now entirely AI-driven, leveraging the Gemini API to generate production-ready form code based on user-defined schemas and selected tech stacks. It no longer uses a template engine.

## 3. Key Files and Directories

*   `src/interfaces/index.ts`: This file contains the TypeScript interfaces for the form schema.
*   `src/pages/Home/Home.tsx`: This is the main component of the application. It contains the `SchemaEditor`, `FormRenderer`, and `OutputPanel` components, and it uses `react-resizable-panels` to create a flexible layout.
*   `src/component/FormGenerator/SchemaEditor/SchemaEditor.tsx`: This component allows users to create and edit the JSON schema for the form. It has three modes:
    *   **Manual:** A simple text area for manual JSON editing.
    *   **UI:** A graphical interface for building the schema.
    *   **AI:** A component that uses a large language model (LLM) to generate the JSON schema from natural language input.
*   `src/component/FormGenerator/SchemaEditor/modes/UIEditor/FieldEditor.tsx`: This component provides a more compact and organized UI for editing the fields in the UI mode. It uses `Accordion` components to show and hide the advanced, validation, and conditional logic sections.
*   `src/component/FormGenerator/SchemaEditor/modes/UIEditor/LayoutEditorModal.tsx`: This component provides a Canvas-based layout editor for precise visual representation and interactive field manipulation.
*   `src/component/FormGenerator/FormRenderer/FormRenderer.tsx`: This component renders the form based on the JSON schema.
*   `src/component/FormGenerator/OutputPanel/OutputPanel.tsx`: This component displays the form data and any validation errors. It also has an "Export" button that allows users to download the generated form as an HTML file, or as code for different web frameworks.
*   `src/utils/ai.ts`: This file contains the logic for interacting with the Gemini API for AI-powered schema generation, AI-driven code generation, and AI-suggested generation options.
*   `src/utils/codeGenerator.ts`: This file now acts as a dispatcher for AI-driven code generation.
*   `src/utils/codeValidator.ts`: This file contains the logic for validating the AI-generated code.
*   `src/utils/validation.ts`: This file contains the logic for validating the form data using Zod.

## 4. Local Setup

To set up the project locally, follow these steps:

1.  Clone the repository.
2.  Create a `.env` file in the root of the project and add your Gemini API key as `VITE_GEMINI_API_KEY`.
3.  Install the dependencies using `npm install`.
4.  Start the development server using `npm run dev`.
5.  Run the tests using `npm test`.

## 5. Conventions

*   The project uses the `camelCase` convention for variable and function names.
*   The project uses the `PascalCase` convention for component names.
*   The project uses the `.tsx` extension for files that contain JSX.

## 6. Recent Changes

*   **AI-Driven Code Generation:** The code generation module (`src/code-generator`) has been refactored to rely entirely on AI (Gemini API) for generating form code. This includes enhanced prompt engineering, a retry mechanism with validation feedback, and few-shot examples to improve accuracy. The previous template engine has been removed.
*   **UI/UX Improvements:**
    *   The `ThemeEditor` component was extracted for better modularity.
    *   The AI Editor UI was streamlined by removing unnecessary checkboxes.
    *   A consistent alert system (`useAlert`) was integrated for error display.
    *   A loading indicator was added for code generation.
    *   More `GenerationOptions` (language, state management, validation) were exposed in the UI.
    *   Dynamic filtering and default setting for generation options based on framework selection were implemented.
    *   Granular control for form title styling and spacing was added to the theme.
*   **Code Validation:** A `codeValidator.ts` utility was introduced to perform basic structural and import checks on AI-generated code, providing feedback for the retry mechanism.
*   **Bug Fixes:** Addressed `TypeError` in `validation.ts` and corrected regex patterns in `codeValidator.ts`.