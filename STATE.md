# Project State: Dynamic Form Generator

## Overview

This project is a web-based application that allows users to dynamically generate forms from a JSON schema. The application has evolved to leverage advanced AI capabilities for code generation, aiming for highly accurate and customizable output.

## Features

### Core Features

*   **Dynamic Form Generation:** The application can generate forms from a JSON schema.
*   **Schema Editor:** Users can create and edit the JSON schema using three different modes:
    *   **Manual:** A simple text area for manual JSON editing.
    *   **UI:** A graphical interface for building the schema.
    *   **AI:** An AI-powered editor that generates the JSON schema from natural language input.
*   **Form Renderer:** The application can render the form based on the JSON schema, adhering to theme and layout properties.
*   **Output Panel:** The application displays the form data and any validation errors in real-time.
*   **AI-Driven Code Generation:** The application now uses a sophisticated AI pipeline to generate production-ready code for various web frameworks and UI libraries. This includes:
    *   **Enhanced Prompt Engineering:** Detailed and structured prompts guide the LLM for accurate code generation, incorporating schema, generation options, and best practices.
    *   **Iterative Refinement & Validation Loop:** Generated code undergoes basic validation, and if issues are found, the AI is provided with specific feedback for retry and refinement.
    *   **Few-shot Examples:** The AI is guided by concrete, correct code examples for common scenarios (e.g., login forms) to improve generation quality.
    *   **Dynamic Language Output:** Generates either TypeScript or JavaScript based on user selection.

### Advanced Features

*   **Conditional Logic:** Users can show or hide fields based on the values of other fields.
*   **Custom Field Types:** The application supports a variety of field types, including:
    *   Text
    *   Email
    *   Number
    *   Select
    *   Checkbox
    *   Date
    *   File Upload
    *   Rich Text Editor
    *   Textarea
*   **Styling and Layout:** Users can customize the styling and layout of the form and its components, including granular control over form title styling and spacing.
*   **API Integration:** The schema supports defining API endpoints for fetching data and submitting the form.
*   **Improved UI/UX:** The UI for editing fields in the UI mode has been improved to be more compact and organized. The main UI is composed of resizable panels. The AI editor UI has been streamlined.
*   **AI-Suggested Generation Options:** AI can suggest optimal code generation options (framework, UI library, etc.) based on a natural language description.

## Next Steps

*   Further enhance the `validateGeneratedCode` function to include more robust checks for styling and layout adherence.
*   Implement a more sophisticated scoring mechanism for LLM responses.
*   Explore integrating a client-side AST parser or a server-side linter/type-checker for more robust code validation.
*   Add support for more frameworks (Vue, Angular) in the AI code generation.