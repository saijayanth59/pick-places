import { useEffect } from "react";
import Progress from "./Progress";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log("Timer Started");
    const timer = setTimeout(() => {
      console.log("Time Ended");
      onConfirm();
    }, 3000);
    return () => {
      console.log("Cleaning Timer");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <Progress />
    </div>
  );
}
