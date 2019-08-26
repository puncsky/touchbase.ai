// @ts-ignore
import ellipsize from "ellipsize";
import fs from "fs";
import yaml from "js-yaml";
import { mdit } from "./markdownit";

const md = mdit;
const ENCODING = "utf8";

export interface ArticleMeta {
  contentHTML: string;
  id: string;
  published: boolean;
  title: string;
  date: string;
  references: Array<string>;
  abstract: string;
  language: string;
  filename: string;
}

export type Snippet = {
  title: string;
  id: string;
  date: string;
  filename: string;
  references: Array<string>;
  abstract: string;
};

export type PostsByIds = {
  [key: string]: ArticleMeta;
};

export type MdContentsByIds = {
  [key: string]: string;
};

export function loadDir(
  dir: string
): {
  snippets: Array<Snippet>;
  postsByIDs: PostsByIds;
  mdContentsByIds: MdContentsByIds;
} {
  const snippets: Array<Snippet> = [];
  const postsByIDs: { [key: string]: ArticleMeta } = {};
  const mdContentsByIds: MdContentsByIds = {};

  // tslint:disable-next-line:non-literal-fs-path
  const filenames = fs.readdirSync(dir, ENCODING);
  filenames.reverse();

  for (const f of filenames) {
    if (f.endsWith(".md") || f.endsWith(".markdown")) {
      // tslint:disable-next-line:non-literal-fs-path
      const text = fs.readFileSync(`${dir}${f}`, ENCODING);
      const { metaObject, mdContent } = parseArticle(f, text);
      if (metaObject.published) {
        snippets.push({
          ...metaObject,
          filename: f,
          abstract:
            metaObject.abstract ||
            ellipsize(
              metaObject.contentHTML,
              metaObject.language === "en" ? 500 : 250
            )
        });
        postsByIDs[metaObject.id] = metaObject;
        mdContentsByIds[metaObject.id] = mdContent;
      }
    }
  }

  return {
    snippets: snippets.sort(
      (s1, s2) => new Date(s2.date).getTime() - new Date(s1.date).getTime()
    ),
    postsByIDs,
    mdContentsByIds
  };
}

export function parseArticle(
  filename: string,
  text: string
): { metaObject: ArticleMeta; mdContent: string } {
  const regExp = /---\n([\s\S]+?)\n---\n([\s\S]+)/m;
  const regResult = regExp.exec(text);
  if (!regResult) {
    return {
      metaObject: {
        contentHTML: "",
        id: "",
        published: false,
        title: "",
        date: "",
        references: [],
        abstract: "",
        language: "",
        filename: ""
      },
      mdContent: ""
    };
  }
  const metaObject = getMeta(regResult[1]);
  const mdContent = regResult[2];
  metaObject.contentHTML = getHTML(mdContent);
  metaObject.id = metaObject.id || getID(filename);
  metaObject.filename = filename;
  if (!metaObject.hasOwnProperty("published")) {
    metaObject.published = true;
  }

  return { metaObject, mdContent };
}

function getID(filename: string): string {
  return filename.replace(".md", "");
}

function getMeta(metaString: string): ArticleMeta {
  return yaml.load(metaString);
}

function getHTML(markdownString: string): string {
  return md.render(markdownString);
}
