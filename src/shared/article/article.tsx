// @ts-ignore
// @ts-ignore
import window from "global";
// @ts-ignore
import loadScript from "load-script";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { PureComponent } from "react";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";
import { fullOnPalm, media } from "../common/styles/style-media";
import { ContentPadding } from "../common/styles/style-padding";

const DOC_STYLES = `

h1 > a.markdownIt-Anchor > span, h2 > a.markdownIt-Anchor > span, h3 > a.markdownIt-Anchor > span, h4 > a.markdownIt-Anchor > span, h5 > a.markdownIt-Anchor > span {
  color: transparent;}

h1:hover > a.markdownIt-Anchor > span, h2:hover > a.markdownIt-Anchor > span, h3:hover > a.markdownIt-Anchor > span, h4:hover > a.markdownIt-Anchor > span, h5:hover > a.markdownIt-Anchor > span {
  color: #dfe3e6; }

h1:hover > a.markdownIt-Anchor:hover > span, h2:hover > a.markdownIt-Anchor:hover > span, h3:hover > a.markdownIt-Anchor:hover > span, h4:hover > a.markdownIt-Anchor:hover > span, h5:hover > a.markdownIt-Anchor:hover > span {
  color: ${colors.primary}; }

h1:focus > a.markdownIt-Anchor:focus > span, h2:focus > a.markdownIt-Anchor:focus > span, h3:focus > a.markdownIt-Anchor:focus > span, h4:focus > a.markdownIt-Anchor:focus > span, h5:focus > a.markdownIt-Anchor:focus > span {
  color: ${colors.primary}; }

h2 {
  border-bottom: 1px solid #dedede;
  padding-bottom: .3em;
}

h1::before, h2::before, h3::before, h4::before, h5::before, h6::before {
  display: block;
  content: " ";
  height: 60px;
  margin-top: -60px;
  visibility: hidden;
}


p {   word-wrap: break-word; }

.top-bar-fixed-top {position: fixed !important;top: 52px;}

.markdownIt-Link-Anchor::before {
  content: "#";
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #dfe2e5;
  margin: 8px 0;
}

table, td, th {
  table-layout: fixed;
  width: 100%;
  background-color: #fff;
  text-align: left;
}

thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

table td, table th {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

table th {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
  font-weight: 600;
}

td, th {
  display: table-cell;
  vertical-align: inherit;
}

table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
`;

function ArticleHeader({
  title,
  enableToc
}: {
  title: string;
  enableToc?: boolean;
}): JSX.Element {
  return (
    <>
      <Helmet
        title={`${title} - ${t("meta.title")}`}
        meta={[
          { property: "og:title", content: `${title} - ${t("meta.title")}` }
        ]}
        link={[
          {
            href:
              "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css",
            rel: "stylesheet"
          }
        ]}
      />
      {enableToc && (
        <Helmet>
          <style type="text/css">{DOC_STYLES}</style>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.4.2/tocbot.css"
          />
        </Helmet>
      )}
    </>
  );
}

type PropType = {
  layout: string;
  title: string;
  date: string;
  comments: number;
  categories: string;
  contentHTML: string;
  allowDonate: boolean;
  visitorCount?: number;
  hasDrawIo?: boolean;
  updateDate?: string;
  references?: Array<string>;
  enableToc?: boolean;
};

export class Article extends PureComponent<PropType> {
  public static defaultProps: { enableToc: boolean } = {
    enableToc: true
  };

  public componentDidMount(): void {
    if (!this.props.enableToc) {
      return;
    }

    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.4.2/tocbot.min.js",
      () => {
        window.tocbot.init({
          // Where to render the table of contents.
          tocSelector: ".js-toc",
          // Where to grab the headings to build the table of contents.
          contentSelector: "article",
          // Which headings to grab inside of the contentSelector element.
          headingSelector: "h2, h3",
          collapseDepth: 2
        });
      }
    );
  }

  public render(): JSX.Element {
    const {
      title,
      date,
      contentHTML,
      visitorCount,
      hasDrawIo,
      updateDate,
      references,
      enableToc
    } = this.props;
    if (window) {
      window.hasDrawIo = hasDrawIo;
    }

    const articleColWidth = enableToc ? "68%" : "auto";

    return (
      <div style={{ width: "100%" }}>
        <ArticleHeader title={title} enableToc={enableToc} />

        <ContentPadding>
          <Flex center={true}>
            <Flex
              width={articleColWidth}
              alignContent="flex-end!important"
              media={fullOnPalm}
              column={true}
            >
              <Article2>
                <h1>{title}</h1>
                {visitorCount !== undefined && (
                  <div className="fas fa-eye">{visitorCount}</div>
                )}{" "}
                {date && (
                  <div className="far fa-calendar-alt">
                    {date}
                    {updateDate && ` (${t("last_updated", { updateDate })})`}
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
                {references && Array.isArray(references) && (
                  <div>
                    <h2>{t("original-post")}</h2>
                    <ul>
                      {references.map((r, i) => (
                        <li key={i}>
                          <a
                            href={r}
                            target="_blank"
                            rel="noopener nofollower noreferrer"
                          >
                            {r}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Article2>
            </Flex>

            {enableToc && (
              <Flex width="32%" media={{ [media.palm]: { display: "none" } }}>
                <nav
                  style={{ maxWidth: "300px", padding: "8px" }}
                  className="toc toc-right js-toc relative z-1 transition--300 absolute pa4 top-bar-fixed-top"
                >
                  <div className="js-toc" />
                </nav>
              </Flex>
            )}
          </Flex>
        </ContentPadding>
      </div>
    );
  }
}

export const Article2 = styled("article", {
  maxWidth: "680px",
  width: "100%",
  color: "#404040!important"
});
