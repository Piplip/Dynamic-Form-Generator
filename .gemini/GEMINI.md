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

## 3. Key Files and Directories

*   `src/interfaces/index.ts`: This file contains the TypeScript interfaces for the form schema.
*   `src/pages/Home/Home.tsx`: This is the main component of the application. It contains the `SchemaEditor`, `FormRenderer`, and `OutputPanel` components.
*   `src/component/FormGenerator/SchemaEditor/SchemaEditor.tsx`: This component allows users to create and edit the JSON schema for the form. It has three modes:
    *   **Manual:** A simple text area for manual JSON editing.
    *   **UI:** A graphical interface for building the schema.
    *   **AI:** A component that uses a large language model (LLM) to generate the JSON schema from natural language input.
*   `src/component/FormGenerator/FormRenderer/FormRenderer.tsx`: This component renders the form based on the JSON schema.
*   `src/component/FormGenerator/OutputPanel/OutputPanel.tsx`: This component displays the form data and any validation errors. It also has an "Export" button that allows users to download the generated form as an HTML file.

## 4. Local Setup

To set up the project locally, follow these steps:

1.  Clone the repository.
2.  Install the dependencies using `npm install`.
3.  Start the development server using `npm run dev`.

## 5. Conventions

*   The project uses the `camelCase` convention for variable and function names.
*   The project uses the `PascalCase` convention for component names.
*   The project uses the `.tsx` extension for files that contain JSX.
