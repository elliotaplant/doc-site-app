import { FieldInputProps, FieldMetaState } from 'react-final-form';
import cn from 'classnames';

interface TextFieldProps {
  input: FieldInputProps<any, HTMLElement>;
  meta: FieldMetaState<any>;
  label: string;
  type?: string;
  placeholder?: string;
  helpText?: string;
  spellcheck?: boolean;
}

export function TextField({
  input,
  meta,
  label,
  placeholder,
  helpText,
  spellcheck,
  type = 'text',
}: TextFieldProps) {
  const showError = Boolean(meta.error && meta.touched);
  const showHelpText = Boolean(helpText && !showError);
  const ariaDescribedBy = [
    showError && `${input.name}:error`,
    showHelpText && `${input.name}:helper`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <label htmlFor={input.name} className="block text-sm font-semibold text-heading">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        aria-describedby={ariaDescribedBy}
        spellCheck={spellcheck}
        className={cn(
          'mt-2 block w-full rounded-xl border-2  bg-transparent px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm',
          showError ? 'border-red-500' : 'border-muted-3'
        )}
        {...input}
      />

      {showError && (
        <p
          aria-live="polite"
          id={`${input.name}:error`}
          className="mt-2 text-xs font-medium text-red-400"
        >
          {meta.error}
        </p>
      )}

      {showHelpText && (
        <p
          aria-live="polite"
          id={`${input.name}:helper`}
          className="mt-2 text-xs font-medium text-text"
        >
          {helpText}
        </p>
      )}
    </div>
  );
}
