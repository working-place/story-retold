import { forwardRef, useId } from 'react';
import styles from './Checkbox.module.scss';

export type CheckboxVariant = '_primary' | '_secondary' | '_outline';

interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;

    variant?: CheckboxVariant;
    className?: string;
    style?: React.CSSProperties;

    label?: string;
    labelPosition?: 'right' | 'left';
    labelClassName?: string;
    requiredMark?: boolean;

    error?: boolean;
    errorText?: string;
    touched?: boolean;

    ariaLabel?: string;
    ariaDescribedBy?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
    checked = false,
    onChange,
    onBlur,
    onFocus,

    name,
    id: propId,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,

    variant = '_primary',
    className = '',
    style,

    label,
    labelPosition = 'right',
    labelClassName = '',

    error = false,
    errorText,
    touched = false,

    ariaLabel,
    ariaDescribedBy,
}, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;

    const showError = error && touched && errorText;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
    };

    const checkboxClasses = [
        styles.checkbox,
        styles[variant],
        error && styles.error,
        disabled && styles.disabled,
        className
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
        styles.wrapper,
        styles[`labelPosition-${labelPosition}`],
        disabled && styles.disabled
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses} style={style}>
            <label htmlFor={id} className={styles.checkboxLabel}>
                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    aria-label={ariaLabel || label}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={error}
                    aria-required={required}
                    className={checkboxClasses}
                />
                <span className={`${styles.checkboxCustom} ${checked ? styles.checked : ''}`}>
                    {checked && (
                        <svg className={styles.checkmark} viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </span>
                {label && (
                    <span className={`${styles.label} ${labelClassName}`}>
                        {label}
                    </span>
                )}
            </label>
            {showError && (
                <span className={styles.errorText}>{errorText}</span>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';
