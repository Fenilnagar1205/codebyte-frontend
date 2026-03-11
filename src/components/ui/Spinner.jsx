export default function Spinner({ size = 32 }) {
  return (
    <div className="flex justify-center items-center py-16">
      <div
        className="rounded-full border-[3px] border-border border-t-accent animate-spin-fast"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
