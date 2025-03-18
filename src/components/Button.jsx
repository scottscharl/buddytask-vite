export default function Button({
  children,
  variant = "primary",

  ...delegated
}) {
  let className = "text-white bg-blue-500";

  if (variant === "secondary") {
    className = "text-black bg-gray-200";
  }

  if (variant === "danger") {
    className = "text-white bg-red-500";
  }

  if (variant === "ghost") {
    className = "bg-transparent hover:underline-offset-2";
  }
  className = className + " px-3 py-2 hover:cursor-pointer";
  return (
    <button className={className} {...delegated}>
      {children}
    </button>
  );
}
