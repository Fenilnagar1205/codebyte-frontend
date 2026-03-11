export default function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex justify-between items-center gap-3 px-4 py-3 my-4
                    bg-orange/10 border border-orange/30 rounded-xl text-orange text-sm">
      <span>⚠ {message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-bold text-[13px] hover:underline bg-transparent border-none text-orange"
        >
          Retry
        </button>
      )}
    </div>
  );
}
