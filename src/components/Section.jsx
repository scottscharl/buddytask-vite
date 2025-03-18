export default function Section({ className = "", children, ...delegated }) {
  return (
    <section
      className={"p-2 border mx-auto rounded border-transparent" + className}
      {...delegated}
    >
      {children}
    </section>
  );
}
