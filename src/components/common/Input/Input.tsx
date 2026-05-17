import { forwardRef, useState, useId, type ReactNode } from "react";
import styles from "./Input.module.scss";

export type InputVariant = '_primary' | '_secondary' | '_outline' | '_ghost';
export type InputSize = 'small' | 'medium' | 'large' | 'checkbox';

interface InputProps {
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url' | 'checkbox';
    name?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    autoComplete?: 'on' | 'off';

    variant?: InputVariant;
    size?: InputSize;
    className?: string;
    style?: React.CSSProperties;

    label?: string;
    labelPosition?: 'top' | 'left' | 'inside';
    labelSize?: 'medium' | 'checkbox';
    labelClassName?: string;
    requiredMark?: boolean;
    requiredMarkClassName?: string;

    error?: boolean;
    errorText?: string;
    touched?: boolean;

    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    onIconRightClick?: () => void;

    loading?: boolean;
    success?: boolean;

    ariaLabel?: string;
    ariaDescribedBy?: string;

    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,

    type = 'text',
    name,
    id: propId,
    placeholder,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    autoComplete = 'off',

    variant = '_primary',
    size = 'medium',
    className = '',
    style,

    label,
    labelPosition = 'top',
    labelSize = 'medium',
    labelClassName = '',
    requiredMark = true,
    requiredMarkClassName = '',

    error = false,
    errorText,
    touched = false,

    iconLeft,
    iconRight,
    onIconRightClick,

    loading = false,
    success = false,

    ariaLabel,
    ariaDescribedBy,

    min,
    max,
    step,
    pattern,
    maxLength,
    minLength,
}, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const [showPassword, setShowPassword] = useState(type === 'password');
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const inputType = type === 'password'
        ? (showPassword ? 'text' : 'password')
        : type;

    const inputClasses = [
        styles.input,
        styles[variant],
        size === 'checkbox' ? styles.checkbox : styles[size],
        error && styles.error,
        success && styles.success,
        disabled && styles.disabled,
        readOnly && styles.readOnly,
        isFocused && styles.focused,
        (iconLeft || loading) && styles.hasIconLeft,
        iconRight && styles.hasIconRight,
        labelPosition === 'inside' && styles.hasLabelInside,
        className
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
        styles.wrapper,
        styles[`labelPosition-${labelPosition}`],
        error && styles.hasError,
        success && styles.hasSuccess,
        disabled && styles.disabled
    ].filter(Boolean).join(' ');

    const showError = error && touched && errorText;

    const renderRequiredMark = () => {
        if (!required || !requiredMark) return null;
        return (
            <span className={`${styles.requiredMark} ${requiredMarkClassName}`}>
                *
            </span>
        );
    };

    const renderLabel = () => {
        if (!label) return null;

        return (
            <label
                htmlFor={id}
                className={`${styles.label} ${labelSize === 'checkbox' ? styles.labelCheckbox : ''} ${labelClassName} ${disabled ? styles.labelDisabled : ''}`}
            >
                {label}
                {renderRequiredMark()}
            </label>
        );
    };

    const renderInsideLabel = () => {
        if (labelPosition !== 'inside' || !label) return null;

        const isLabelActive = isFocused || value || placeholder;

        return (
            <label
                htmlFor={id}
                className={`${styles.insideLabel} ${isLabelActive ? styles.insideLabelActive : ''} ${disabled ? styles.insideLabelDisabled : ''}`}
            >
                {label}
                {renderRequiredMark()}
            </label>
        );
    };

    return (
        <div className={wrapperClasses} style={style}>

            {labelPosition === 'top' && renderLabel()}

            <div className={styles.inputWrapper}>

                {labelPosition === 'inside' && renderInsideLabel()}

                {(iconLeft || loading) && (
                    <div className={styles.iconLeft}>
                        {loading ? (
                            <div className={styles.spinner} />
                        ) : (
                            iconLeft
                        )}
                    </div>
                )}

                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={onKeyDown}
                    placeholder={labelPosition === 'inside' && !isFocused && !value ? '' : placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    aria-label={ariaLabel || label}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={error}
                    aria-required={required}
                    className={inputClasses}
                    min={min}
                    max={max}
                    step={step}
                    pattern={pattern}
                    maxLength={maxLength}
                    minLength={minLength}
                />

                {(iconRight || type === 'password') && (
                    <div
                        className={styles.iconRight}
                        onClick={type === 'password' ? togglePasswordVisibility : onIconRightClick}
                    >
                        {type === 'password' ? (
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M2.5 12C2.5 12 5.5 4.5 12 4.5C18.5 4.5 21.5 12 21.5 12C21.5 12 18.5 19.5 12 19.5C5.5 19.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M2.999 2.999L20.999 20.999" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M9.843 9.843C9.313 10.468 8.999 11.249 8.999 12C8.999 13.6569 10.342 15 12 15C12.751 15 13.532 14.686 14.157 14.157" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M17.5 6.5C19.5 8.5 20.5 12 20.5 12C20.5 12 18.5 19.5 12 19.5C11.286 19.5 10.604 19.384 9.965 19.176" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M5.5 5.5C3.5 7.5 2.5 12 2.5 12C2.5 12 5.5 19.5 12 19.5" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                )}
                            </button>
                        ) : (
                            iconRight
                        )}
                    </div>
                )}
            </div>

            {showError && (
                <span className={styles.errorText}>
                    {errorText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
