// import styles from "./Button.module.scss"

// interface ButtonProps {
//     text?: string | undefined;
// }

// export default function Button({ text }: ButtonProps) {

//     return (
//         <button className={styles.button}>
//             {/* <h1>Button {text}</h1> */}
//         </button>
//     )
// }

import { type ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
    children?: ReactNode;           // Содержимое кнопки (текст, иконка, картинка)
    text?: string;                  // Текст кнопки (альтернатива children)
    onClick?: () => void;           // Обработчик клика
    type?: "button" | "submit" | "reset";  // Тип кнопки
    disabled?: boolean;             // Блокировка кнопки
    variant?: "primary" | "secondary" | "outline" | "ghost";  // Предопределённые варианты
    size?: "small" | "medium" | "large";  // Размеры
    backgroundColor?: string;       // Свой цвет фона
    color?: string;                 // Цвет текста
    width?: string | number;        // Ширина (100%, 200px, auto)
    height?: string | number;       // Высота
    padding?: string;               // Отступы (10px 20px)
    fontSize?: string | number;     // Размер шрифта
    borderRadius?: string | number; // Скругление углов
    className?: string;             // Дополнительный CSS класс
    icon?: ReactNode;               // Иконка слева
    iconRight?: ReactNode;          // Иконка справа
    fullWidth?: boolean;            // На всю ширину родителя
    loading?: boolean;              // Состояние загрузки
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

    // Сборка классов
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ');

    // Инлайн-стили для кастомизации
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
