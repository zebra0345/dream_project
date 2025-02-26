const AuthInput = ({
  label,
  name,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  placeholder,
  disabled,
  className
}) => {
  return (
    <div className="mb-2">
      <label
        className="block text-gray-700 text-sm font-bold mt-6 mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-user-input ${
            error ? "border-red-500" : ""
          } ${className || ""}`}
        />
        <p
          className={`absolute left-0 top-full text-red-500 text-xs mt-0.5 transition-all ${
            error ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {error}
        </p>
      </div>
    </div>
  );
};

export default AuthInput;
