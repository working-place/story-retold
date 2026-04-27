import { type ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
    children?: ReactNode;
    text?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "small" | "medium" | "large";
    backgroundColor?: string;
    color?: string;
    width?: string | number;
    height?: string | number;
    padding?: string;
    fontSize?: string | number;
    borderRadius?: string | number;
    className?: string;
    icon?: ReactNode;
    iconRight?: ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
}

export default function Button({
    children,
    text,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    size = "medium",
    backgroundColor,
    color,
    width,
    height,
    padding,
    fontSize,
    borderRadius,
    className = "",
    icon,
    iconRight,
    fullWidth = false,
    loading = false
}: ButtonProps) {

    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ');

    const customStyles: React.CSSProperties = {
        ...(backgroundColor && { backgroundColor }),
        ...(color && { color }),
        ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
        ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
        ...(padding && { padding }),
        ...(fontSize && { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize }),
        ...(borderRadius && { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius })
    };

    const content = children || text;

    return (
        <button
            type={type}
            className={buttonClasses}
            style={customStyles}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading && <span className={styles.spinner}></span>}
            {icon && <span className={styles.icon}>{icon}</span>}
            {content && <span className={styles.content}>{content}</span>}
            {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
        </button>
    );
}
