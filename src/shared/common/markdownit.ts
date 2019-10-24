import MarkdownIt from "markdown-it";
// @ts-ignore
import markMiddleware from "markdown-it-mark";
// @ts-ignore
import markdownItTocAndAnchor from "markdown-it-toc-and-anchor";

export const mdit = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(markMiddleware)
  .use(markdownItTocAndAnchor, {
    anchorLinkBefore: false,
    anchorLinkSymbol: "",
    anchorLinkSymbolClassName: "markdownIt-Link-Anchor"
  });
