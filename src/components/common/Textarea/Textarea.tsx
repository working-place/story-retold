// src/components/UI/Textarea/Textarea.tsx
import React, { forwardRef, useId } from 'react';
import styles from './Textarea.module.scss';

export type TextareaVariant = '_primary' | '_secondary' | '_outline' | '_ghost';
export type TextareaSize = 'small' | 'medium' | 'large';
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

interface TextareaProps {
    // Базовые пропсы
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;

    // Атрибуты
    name?: string;
    id?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    autoComplete?: 'on' | 'off';

    // Стилизация
    variant?: TextareaVariant;
    size?: TextareaSize;
    resize?: TextareaResize;
    className?: string;
    style?: React.CSSProperties;

    // Label
    label?: string;
    labelPosition?: 'top' | 'left' | 'inside';
    labelClassName?: string;
    requiredMark?: boolean;

    // Состояния
    error?: boolean;
    errorText?: string;
    touched?: boolean;
    loading?: boolean;
    success?: boolean;

    // Счётчик символов
    showCounter?: boolean;

    // A11y
    ariaLabel?: string;
    ariaDescribedBy?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,

    name,
    id: propId,
    placeholder,
    rows = 4,
    cols,
    maxLength,
    minLength,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    autoComplete = 'off',

    variant = '_primary',
    size = 'medium',
    resize = 'vertical',
    className = '',
    style,

    label,
    labelPosition = 'top',
    labelClassName = '',
    requiredMark = true,

    error = false,
    errorText,
    touched = false,
    loading = false,
    success = false,

    showCounter = false,

    ariaLabel,
    ariaDescribedBy,
}, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const showError = error && touched && errorText;
    const currentLength = String(value || '').length;
    const isNearLimit = maxLength && currentLength > maxLength * 0.9;
    const isOverLimit = maxLength && currentLength > maxLength;

    const textareaClasses = [
        styles.textarea,
        styles[variant],
        styles[size],
        styles[`resize-${resize}`],
        error && styles.error,
        success && styles.success,
        disabled && styles.disabled,
        readOnly && styles.readOnly,
        isFocused && styles.focused,
        className
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
        styles.wrapper,
        styles[`labelPosition-${labelPosition}`],
        error && styles.hasError,
        success && styles.hasSuccess,
        disabled && styles.disabled
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses} style={style}>
            {label && labelPosition === 'top' && (
                <label htmlFor={id} className={`${styles.label} ${labelClassName}`}>
                    {label}
                    {required && requiredMark && <span className={styles.requiredMark}>*</span>}
                </label>
            )}

            <div className={styles.textareaWrapper}>
                {loading && (
                    <div className={styles.spinnerOverlay}>
                        <div className={styles.spinner} />
                    </div>
                )}

                {label && labelPosition === 'inside' && (
                    <label className={`${styles.insideLabel} ${(isFocused || value) ? styles.insideLabelActive : ''}`}>
                        {label}
                        {required && requiredMark && <span className={styles.requiredMark}>*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={onKeyDown}
                    placeholder={labelPosition === 'inside' && !isFocused && !value ? '' : placeholder}
                    rows={rows}
                    
                    cols={cols}
                    maxLength={maxLength}
                    minLength={minLength}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    aria-label={ariaLabel || label}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={error}
                    aria-required={required}
                    className={textareaClasses}
                />
            </div>

            <div className={styles.bottomPanel}>
                {showError && (
                    <span className={styles.errorText}>
                        {errorText}
                    </span>
                )}

                {showCounter && maxLength && (
                    <span className={`${styles.counter} ${isOverLimit ? styles.overLimit : ''} ${isNearLimit ? styles.nearLimit : ''}`}>
                        {currentLength} / {maxLength}
                    </span>
                )}
            </div>
        </div>
    );
});

Textarea.displayName = 'Textarea';
