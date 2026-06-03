export function ErrorState({ message, onRetry }) {
  return (
    <div className="error">
      <p>Error: {message}</p>
      <button onClick={onRetry} className="retry-btn">
        Try again
      </button>
    </div>
  );
}
