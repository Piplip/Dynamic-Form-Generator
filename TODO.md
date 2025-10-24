# TODO List

## Completed Tasks

*   **Refactor UIEditor to fully reflect all control properties for each input field:**
    *   Ensured all properties defined in `FieldSchema` are editable through the `UIEditor`.
    *   Specifically, added controls for `labelPlacement` and `variant` properties for input fields.
    *   Added a new "Layout" accordion that will be displayed for all field types except "button". This accordion contains dropdowns to select the `labelPlacement` and `variant` properties.
*   **Implement AI-Powered Schema Generation:** Integrated Gemini API to generate JSON schema from natural language.
*   **Add More Field Types:** Supported various field types including date picker, file upload, and rich text editor.
*   **Implement Conditional Logic:** Added functionality to show/hide fields based on other field values.
*   **Build the Advanced Code Generation Engine:** Transitioned to an AI-only code generation approach, removing the Handlebars template engine.
    *   Implemented enhanced prompt engineering for the LLM.
    *   Integrated a basic iterative refinement and validation loop with retry mechanism.
    *   Added few-shot examples to guide AI code generation.
    *   Enabled dynamic language output (TypeScript/JavaScript).
*   **Improve UI/UX:**
    *   Extracted `ThemeEditor` component for better modularity.
    *   Streamlined AI Editor UI by removing unnecessary checkboxes.
    *   Integrated `useAlert` for consistent error display.
    *   Added loading indicator for code generation.
    *   Exposed more `GenerationOptions` in the UI (language, state management, validation).
    *   Implemented dynamic filtering and default setting for generation options based on framework selection.
*   **Add Unit and Integration Tests:** Added unit tests for `ThemeEditor` and fixed issues in `UIEditor` related to `dnd-kit` (which was later removed).

## Next Steps (from STATE.md)

*   Further enhance the `validateGeneratedCode` function to include more robust checks for styling and layout adherence.
*   Implement a more sophisticated scoring mechanism for LLM responses.
*   Explore integrating a client-side AST parser or a server-side linter/type-checker for more robust code validation.
*   Add support for more frameworks (Vue, Angular) in the AI code generation.