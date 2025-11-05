"use client";
export default function Placeholder({ isResetDraw }: { isResetDraw?: boolean; }) {
  return (
    <div className="card-list">
      <div className="placeholder normal">{isResetDraw ? <img src="/refresh-icon.svg" alt="Refresh"/> : null}</div>
    </div>
  );
}
