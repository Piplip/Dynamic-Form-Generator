import { describe, it, expect, vi } from 'vitest';
import { generateCodeWithAI } from './ai';
import { FormSchema } from '../interfaces';
import { GenerationOptions } from '../code-generator';

// Mock the GoogleGenerativeAI and its methods
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

describe('generateCodeWithAI', () => {
  const mockSchema: FormSchema = {
    fields: [
      { name: 'username', type: 'text', label: 'Username' },
      { name: 'password', type: 'text', label: 'Password' },
    ],
  };

  const mockOptions: GenerationOptions = {
    framework: 'react',
    language: 'typescript',
    uiLibrary: 'Tailwind',
    stateManagement: 'react-hook-form',
    validation: 'zod',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the Gemini API with the correct prompt and schema', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '```tsx\n// Generated code\n```' },
    });

    await generateCodeWithAI(mockSchema, mockOptions);

    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
    expect(mockGenerateContent).toHaveBeenCalledOnce();
    const prompt = mockGenerateContent.mock.calls[0][0];
    expect(prompt).toContain(JSON.stringify(mockSchema, null, 2));
    expect(prompt).toContain(JSON.stringify(mockOptions, null, 2));
    expect(prompt).toContain('Generate TypeScript code, including interfaces and type annotations.');
  });

  it('should include previous validation errors in the prompt if provided', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '// Generated code with errors fixed\n' },
    });

    const lastValidationResult = {
      isValid: false,
      errors: ['Missing React import.', 'Missing useForm initialization.'],
      warnings: [],
      score: 50,
    };

    await generateCodeWithAI(mockSchema, mockOptions, lastValidationResult);

    const prompt = mockGenerateContent.mock.calls[0][0];
    expect(prompt).toContain('**Previous Generation Feedback:**');
    expect(prompt).toContain('Score: 50/100');
    expect(prompt).toContain('Errors:\n```\nMissing React import.\nMissing useForm initialization.\n```');
    expect(prompt).toContain('Please review this feedback and regenerate the code, focusing on improving the score and addressing any errors or warnings.');
  });

  it('should extract code from markdown block if present', async () => {
    const generatedCode = "import React from 'react';\nconst MyForm = () => <form></form>;\nexport default MyForm;\n";
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => "```tsx\n" + generatedCode + "\n```" },
    });

    const result = await generateCodeWithAI(mockSchema, mockOptions);
    expect(result).toBe(generatedCode);
  });

  it('should return raw code if no markdown block is found', async () => {
    const generatedCode = 'import React from \'react\';\nconst MyForm = () => <form></form>;\nexport default MyForm;\n';
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => generatedCode },
    });

    const result = await generateCodeWithAI(mockSchema, mockOptions);
    expect(result).toBe(generatedCode);
  });

  it('should handle JavaScript language option correctly', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '```jsx\n// JS Generated code\n```' },
    });

    const jsOptions = { ...mockOptions, language: 'javascript' };
    await generateCodeWithAI(mockSchema, jsOptions);

    const prompt = mockGenerateContent.mock.calls[0][0];
    expect(prompt).toContain('Generate pure JavaScript (ES6+) code. Do NOT use TypeScript syntax');
  });
});
