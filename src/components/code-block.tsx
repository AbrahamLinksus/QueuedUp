import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <SyntaxHighlighter
      language={language || "plaintext"}
      style={oneDark}
      customStyle={{
        margin: 0,
        borderRadius: 0,
        fontSize: "0.75rem",
        background: "#1e1e1e",
        padding: "1rem",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
