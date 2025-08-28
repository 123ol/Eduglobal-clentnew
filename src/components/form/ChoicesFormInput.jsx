import Choices from 'choices.js';
import { useEffect, useRef } from 'react';

const ChoicesFormInput = ({
  children,
  multiple = false,
  className = '',
  onChange,
  allowInput = false,
  options = {},
  ...props
}) => {
  const choicesRef = useRef(null);
  const choicesInstance = useRef(null);

  useEffect(() => {
    if (choicesRef.current) {
      // Destroy old instance if exists
      if (choicesInstance.current) {
        choicesInstance.current.destroy();
      }

      // Initialize Choices.js
      choicesInstance.current = new Choices(choicesRef.current, {
        ...options,
        placeholder: true,
        allowHTML: true,
        shouldSort: false,
      });

      // Listen for value changes
      const element = choicesInstance.current.passedElement.element;
      const handleChange = (e) => {
        if (onChange) {
          if (multiple) {
            const selectedValues = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            onChange(selectedValues);
          } else {
            onChange(e.target.value);
          }
        }
      };
      element.addEventListener('change', handleChange);

      // Cleanup
      return () => {
        element.removeEventListener('change', handleChange);
        if (choicesInstance.current) {
          choicesInstance.current.destroy();
          choicesInstance.current = null;
        }
      };
    }
  }, [choicesRef, options, multiple, onChange]);

  // Render input or select depending on allowInput
  if (allowInput) {
    return (
      <input
        ref={choicesRef}
        multiple={multiple}
        className={className}
        {...props}
      />
    );
  }

  return (
    <select
      ref={choicesRef}
      multiple={multiple}
      className={className}
      {...props}
    >
      {/* If options.choices is passed, Choices.js will override children. 
          Otherwise fallback to rendering children <option> */}
      {options?.choices ? null : children}
    </select>
  );
};

export default ChoicesFormInput;
