/**
 * Utility functions để format text từ API cho hiển thị đẹp
 */

/**
 * Convert markdown bold (**text**) sang HTML
 * @param {string} text - Text cần format
 * @returns {JSX} - Formatted JSX elements
 */
export const formatMarkdownText = (text) => {
  if (!text) return null;

  // Tách text thành các phần dựa trên **
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    // Nếu phần này được bọc trong **
    if (part.startsWith("**") && part.endsWith("**")) {
      // Loại bỏ ** và return text in đậm
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-gray-900 dark:text-white">
          {boldText}
        </strong>
      );
    }
    // Return text bình thường
    return <span key={index}>{part}</span>;
  });
};

/**
 * Format text với line breaks và markdown
 * @param {string} text - Text cần format
 * @returns {JSX[]} - Array of formatted paragraphs
 */
export const formatParagraphsWithMarkdown = (text) => {
  if (!text) return null;

  // Tách theo dòng mới
  const paragraphs = text.split("\n").filter((p) => p.trim());

  return paragraphs.map((paragraph, pIndex) => {
    // Format markdown trong mỗi đoạn
    const formattedContent = formatMarkdownText(paragraph);

    return (
      <p
        key={pIndex}
        className="mb-3 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed"
      >
        {formattedContent}
      </p>
    );
  });
};

/**
 * Detect và highlight emoji
 * @param {string} text - Text chứa emoji
 * @returns {string} - Text với emoji được highlight
 */
export const highlightEmoji = (text) => {
  if (!text) return text;

  // Regex detect emoji
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  return text.replace(emojiRegex, (emoji) => {
    return `<span class="text-2xl inline-block mx-1">${emoji}</span>`;
  });
};

/**
 * Format step text - tách tiêu đề bước và nội dung
 * @param {string} text - Text của step
 * @returns {object} - {title, content}
 */
export const parseStepText = (text) => {
  if (!text) return { title: "", content: text };

  // Pattern: "Bước X: Title" hoặc "**Bước X: Title**"
  const stepPattern = /^\*?\*?(Bước\s+\d+:.*?)(\*\*)?[\r\n]/i;
  const match = text.match(stepPattern);

  if (match) {
    const title = match[1].replace(/\*\*/g, "").trim();
    const content = text.replace(stepPattern, "").trim();
    return { title, content };
  }

  // Pattern: Line đầu tiên là tiêu đề (in đậm)
  const lines = text.split("\n");
  if (lines[0].includes("**")) {
    return {
      title: lines[0].replace(/\*\*/g, "").trim(),
      content: lines.slice(1).join("\n").trim(),
    };
  }

  return { title: "", content: text };
};

/**
 * Format decoration tips với sections
 * @param {string} text - Decoration tips text
 * @returns {object[]} - Array of {title, content}
 */
export const parseDecorationTips = (text) => {
  if (!text) return [];

  const sections = [];
  // Split theo pattern "**Bước X:"
  const stepPattern = /\*\*Bước\s+\d+:.*?\*\*/g;
  const matches = text.match(stepPattern);

  if (!matches) {
    // Nếu không có pattern bước, return toàn bộ text
    return [{ title: "", content: text }];
  }

  let currentIndex = 0;
  matches.forEach((match, idx) => {
    const matchIndex = text.indexOf(match, currentIndex);
    const title = match.replace(/\*\*/g, "").trim();

    // Tìm nội dung từ sau title đến title tiếp theo hoặc end
    const nextMatchIndex =
      idx < matches.length - 1
        ? text.indexOf(matches[idx + 1], matchIndex)
        : text.length;

    const content = text
      .substring(matchIndex + match.length, nextMatchIndex)
      .trim();

    sections.push({ title, content });
    currentIndex = nextMatchIndex;
  });

  return sections;
};

/**
 * Format notes với bullets và highlights
 * @param {string} text - Notes text
 * @returns {object[]} - Array of note items
 */
export const parseNotes = (text) => {
  if (!text) return [];

  // Tách theo bullet points (-, *, •)
  const lines = text.split("\n").filter((l) => l.trim());
  const notes = [];
  let currentNote = null;

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Check if it's a bullet point
    if (trimmed.match(/^[-*•]/)) {
      if (currentNote) notes.push(currentNote);
      currentNote = {
        type: "bullet",
        content: trimmed.replace(/^[-*•]\s*/, ""),
      };
    } else if (trimmed.includes("**") && trimmed.includes(":")) {
      // Tiêu đề section
      if (currentNote) notes.push(currentNote);
      currentNote = {
        type: "heading",
        content: trimmed.replace(/\*\*/g, ""),
      };
    } else if (currentNote) {
      // Continue previous note
      currentNote.content += " " + trimmed;
    } else {
      // Standalone text
      notes.push({ type: "text", content: trimmed });
    }
  });

  if (currentNote) notes.push(currentNote);
  return notes;
};

/**
 * Smart format cho bất kỳ text nào từ API
 * @param {string} text - Text cần format
 * @param {string} type - Type: 'step', 'tip', 'note', 'decoration'
 * @returns {JSX} - Formatted content
 */
export const smartFormatText = (text, type = "default") => {
  if (!text) return null;

  switch (type) {
    case "step":
      return parseStepText(text);
    case "decoration":
      return parseDecorationTips(text);
    case "note":
      return parseNotes(text);
    default:
      return formatParagraphsWithMarkdown(text);
  }
};
