import { describe, it, expect } from 'vitest';
import { validateGeneratedCode } from './codeValidator';
import { FormSchema } from '../interfaces';
import { GenerationOptions } from '../code-generator';

describe('validateGeneratedCode', () => {
  const mockSchema: FormSchema = {
    fields: [
      { name: 'email', type: 'text', label: 'Email' },
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

  it('should return isValid true and a score of 100 for perfectly valid code', () => {
    const validCode = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string(), password: z.string() })),
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} className="border" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" {...register('password')} className="border" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
    `;

    const result = validateGeneratedCode(validCode, mockOptions, mockSchema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.score).toBe(100);
  });

  it('should detect missing React import', () => {
    const code = `
const MyForm: React.FC = () => {
  return <form></form>;
};
export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing React import.');
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing component definition', () => {
    const code = `
import React from 'react';
// No component here
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Could not find a React functional component definition.');
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing react-hook-form imports and usage', () => {
    const code = `
import React from 'react';
const MyForm: React.FC = () => {
  return <form></form>;
};
export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing useForm import from react-hook-form.');
    expect(result.errors).toContain('Missing useForm initialization.');
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing zod imports and usage', () => {
    const code = `
import React from 'react';
import { useForm } from 'react-hook-form';
const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({});
  const onSubmit = (data: any) => console.log(data);
  return <form onSubmit={handleSubmit(onSubmit)}></form>;
};
export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing zodResolver import from @hookform/resolvers/zod.');
    expect(result.errors).toContain('Missing z import from zod.');
    expect(result.errors).toContain('Missing zodResolver in useForm configuration.');
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing form submission handler', () => {
    const code = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string(), password: z.string() })),
  });

  // Missing onSubmit

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} className="border" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing form submission handler (handleSubmit).');
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing field rendering with className', () => {
    const code = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string(), password: z.string() })),
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} /> {/* Missing className */}
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" {...register('password')} className="border" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Field 'email' does not appear to be rendered with a className attribute.");
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing field registration', () => {
    const code = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string(), password: z.string() })),
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" className="border" /> {/* Missing register */}
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" {...register('password')} className="border" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Field 'email' is not registered with react-hook-form.");
    expect(result.score).toBeLessThan(100);
  });

  it('should detect missing error message display', () => {
    const code = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string(), password: z.string() })),
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} className="border" />
        {/* Missing error display for email */}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" {...register('password')} className="border" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, mockSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Missing error message display for field 'email'.");
    expect(result.score).toBeLessThan(100);
  });

  it('should handle schema with button type fields correctly', () => {
    const schemaWithButton: FormSchema = {
      fields: [
        { name: 'submit', type: 'button', label: 'Submit' },
      ],
    };
    const code = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyForm: React.FC = () => {
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type="submit">Submit</button>
    </form>
  );
};
export default MyForm;
    `;
    const result = validateGeneratedCode(code, mockOptions, schemaWithButton);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.score).toBe(100);
  });
});
