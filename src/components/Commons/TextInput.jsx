function TextInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  width = "200px",
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`border border-[#DAE0E6] dark:border-[#5f6368] dark:bg-transparent dark:text-[#e8eaed] rounded-md px-4 py-3 outline-0 focus:border-[#299CB3] dark:placeholder-[#9aa0a6] transition-colors duration-200 ${className}`}
      style={{
        width:
          className.includes("w-") || className.includes("flex-")
            ? undefined
            : width,
      }}
    />
  );
}

export default TextInput;
