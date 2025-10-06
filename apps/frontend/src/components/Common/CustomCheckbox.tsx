import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  label?: string;
  icon?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
  id,
  label,
  icon,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const checkboxElement = (
    <div className={`custom-checkbox ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}>
      <input type="checkbox" id={id} checked={checked} onChange={handleChange} disabled={disabled} />
      <span className="checkmark"></span>
    </div>
  );

  if (label) {
    return (
      <div className="flex items-center gap-2 cursor-pointer justify-center">
        {checkboxElement}
        {icon && (
          <img
            src={icon}
            alt="Expand account"
            className="w-6"
            style={{ filter: disabled ? "grayscale(50%)" : "none" }}
          />
        )}
        <span className={`${disabled ? "text-text-secondary opacity-40" : "text-text-primary"}`}>{label}</span>
      </div>
    );
  }

  return checkboxElement;
};
