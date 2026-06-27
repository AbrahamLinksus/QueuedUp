export type Block =
  | { type: "text"; md: string }
  | { type: "bullets"; items: string[] }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "heading"; text: string };

export type LLDContent = {
  slug: string;
  title: string;
  section: string;
  tagline: string;
  blocks: Block[];
};
