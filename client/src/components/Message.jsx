export default function Message({ sender, text }) {
  return (
    <div className={`message ${sender}`}>
      <p>{text}</p>
    </div>
  );
}
