
import { useContext, useRef, useState } from "react";

import "./InputBox.css";
import { MyContext } from "./MyContext.jsx";

export default function Inputbox() {
  const { prompt, setPrompt, getReply, isLoading } =
    useContext(MyContext);

  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files);

    setAttachments((prev) => {
      const newFiles = selectedFiles.filter(
        (file) =>
          !prev.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified
          )
      );

      return [...prev, ...newFiles];
    });

    // Allows selecting the same file again later.
    event.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <form
      className="inputbox"
      onSubmit={(event) => {
        event.preventDefault();
        getReply();
      }}
    >
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((file, index) => (
            <div className="attachment-item" key={`${file.name}-${file.lastModified}-${index}`}>
              <i
                className={`fa-solid ${
                  file.type.startsWith("image/")
                    ? "fa-image"
                    : "fa-file-lines"
                }`}
              ></i>

              <span title={file.name}>{file.name}</span>

              <button
                type="button"
                className="remove-attachment"
                onClick={() => removeAttachment(index)}
                aria-label={`Remove ${file.name}`}
                disabled={isLoading}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="file-input"
        accept="image/*,.pdf,.txt,.doc,.docx"
        multiple
        onChange={handleFiles}
      />

      <button
        type="button"
        className="input-btn attachment-btn"
        aria-label="Add attachment"
        title="Add files or photos"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <i className="fa-solid fa-plus" aria-hidden="true" />
      </button>

      <input
        type="text"
        value={prompt}
        placeholder="Ask Promptly anything..."
        aria-label="Message"
        onChange={(event) => setPrompt(event.target.value)}
        disabled={isLoading}
      />

      <button
        type="submit"
        className="input-btn send-btn"
        aria-label="Send message"
        disabled={isLoading || !prompt.trim()}
      >
        <i className="fa-solid fa-arrow-up" aria-hidden="true" />
      </button>
    </form>
  );
}
