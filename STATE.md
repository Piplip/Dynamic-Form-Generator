# Project State: Dynamic Form Generator

## Overview

This project is a web-based application that allows users to dynamically generate forms from a JSON schema. The application is in a good state and has a solid foundation. The core features are implemented and the code is well-structured.

## Features

### Core Features

*   **Dynamic Form Generation:** The application can generate forms from a JSON schema.
*   **Schema Editor:** Users can create and edit the JSON schema using three different modes:
    *   **Manual:** A simple text area for manual JSON editing.
    *   **UI:** A graphical interface for building the schema with drag-and-drop support.
    *   **AI:** An AI-powered editor that generates the JSON schema from natural language input.
*   **Form Renderer:** The application can render the form based on the JSON schema.
*   **Output Panel:** The application displays the form data and any validation errors in real-time.
*   **Code Generation:** The application can generate code for different web frameworks, including React.

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
*   **Styling and Layout:** Users can customize the styling and layout of the form and its components.
*   **API Integration:** The schema supports defining API endpoints for fetching data and submitting the form.
*   **Improved UI/UX:** The UI for editing fields in the UI mode has been improved to be more compact and organized. It uses `Accordion` components to show and hide the advanced, validation, and conditional logic sections.
*   **Flexible Layout:** The main UI is now composed of resizable panels, allowing users to adjust the size of the schema editor, form preview, and JSON output panels. The JSON output panel can also be minimized.
*   **Canvas-based Layout Editor:** A new Canvas-based layout editor has been implemented for precise visual representation and interactive field manipulation.

## Next Steps

The project is in a good state. The next steps could be to add user authentication, or to add more features to the code generation engine.
A task to refactor the `UIEditor` to fully reflect all control properties for each input field has been added to `TODO.md`.
