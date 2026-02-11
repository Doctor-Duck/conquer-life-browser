import React from "react";

export function SaveNotification({ isVisible, isAutoSave, onClose }) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto-hide after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="save-notification">
      <div className="save-notification-content">
        <div className="save-notification-icon">
          {isAutoSave ? "💾" : "✓"}
        </div>
        <div className="save-notification-text">
          {isAutoSave ? "Game auto-saved" : "Game saved"}
        </div>
      </div>
    </div>
  );
}
