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
*   `src/utils/ai.ts`: This file contains the logic for interacting with the Gemini API to generate the JSON schema from natural language.
*   `src/utils/codeGenerator.ts`: This file contains the logic for generating code for different web frameworks.
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

*   **UIEditor Refactoring:** The `UIEditor` has been refactored to fully reflect all control properties for each input field. This includes:
    *   Adding controls for `labelPlacement` and `variant` properties for input fields.
    *   Introducing a new "Layout" accordion that is displayed for all field types except "button", containing dropdowns to select `labelPlacement` and `variant` properties.
    *   The `FieldSchema` interface in `src/interfaces/index.ts` was updated to use type-specific layout properties (`inputLayout` and `fileLayout`) instead of a generic `layout` property.
    *   The `FieldEditor.tsx` component was updated to conditionally render layout controls based on the field type.
    *   The `FormRenderer.tsx` component was updated to correctly pass type-specific layout properties to the `GenericFieldRenderer`.