import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Editor from "rich-markdown-editor";
import { debounce } from "./debounce";

type Props = {
  initialValue: string;
  onChange: (value: string | null) => void;
};

export const EDITOR_BLOCK_MENU_ITEM_HEIGHT = 36;

const colors = {
  almostBlack: "#181A1B",
  lightBlack: "#2F3336",
  almostWhite: "#E6E6E6",
  white: "#FFF",
  white10: "rgba(255, 255, 255, 0.1)",
  black: "#000",
  black10: "rgba(0, 0, 0, 0.1)",
  primary: "#1AB6FF",
  greyLight: "#F4F7FA",
  grey: "#E8EBED",
  greyMid: "#C5CCD3",
  greyDark: "#DAE1E9"
};

const editorTheme = {
  ...colors,
  zIndex: 1001,
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen, Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
  fontFamilyMono:
    "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace",
  fontWeight: 400,
  link: colors.primary,
  placeholder: "#B1BECC",
  textSecondary: "#4E5C6E",
  textLight: colors.white,
  textHighlight: "#b3e7ff",
  selected: colors.primary,
  codeComment: "#6a737d",
  codePunctuation: "#5e6687",
  codeNumber: "#d73a49",
  codeProperty: "#c08b30",
  codeTag: "#3d8fd1",
  codeString: "#032f62",
  codeSelector: "#6679cc",
  codeAttr: "#c76b29",
  codeEntity: "#22a2c9",
  codeKeyword: "#d73a49",
  codeFunction: "#6f42c1",
  codeStatement: "#22a2c9",
  codePlaceholder: "#3d8fd1",
  codeInserted: "#202746",
  codeImportant: "#c94922",

  blockToolbarBackground: colors.white,
  blockToolbarTrigger: colors.greyMid,
  blockToolbarTriggerIcon: colors.white,
  blockToolbarItem: colors.almostBlack,
  blockToolbarText: colors.almostBlack,
  blockToolbarHoverBackground: colors.greyLight,
  blockToolbarDivider: colors.greyMid,

  noticeInfoBackground: "#F5BE31",
  noticeInfoText: colors.almostBlack,
  noticeTipBackground: "#9E5CF7",
  noticeTipText: colors.white,
  noticeWarningBackground: "#FF5C80",
  noticeWarningText: colors.white,
  background: colors.white,
  text: colors.almostBlack,
  code: colors.lightBlack,
  cursor: colors.black,
  divider: colors.greyMid,

  toolbarBackground: colors.lightBlack,
  toolbarHoverBackground: colors.black,
  toolbarInput: colors.white10,
  toolbarItem: colors.white,

  tableDivider: colors.greyMid,
  tableSelected: colors.primary,
  tableSelectedBackground: "#E5F7FF",

  quote: colors.greyDark,
  codeBackground: colors.greyLight,
  codeBorder: colors.grey,
  horizontalRule: colors.greyMid,
  imageErrorBackground: colors.greyLight,

  scrollbarBackground: colors.greyLight,
  scrollbarThumb: colors.greyMid
};

const EditorWrapper = styled.div`
  padding: 1em 2.5em;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: scroll;
  min-height: 5rem;
  max-height: 30vh;
  transition: border-color 0.3s;

  &.focus {
    border-color: #cd96e3;
    box-shadow: 0 0 0 2px rgba(180, 107, 214, 0.2);
  }
`;

const cacheEditorContent = debounce(value => {
  const text = value();
  localStorage.setItem("event-editor", text);
});

export const RichMdEditor = (props: Props): React.ReactElement => {
  const { initialValue, onChange } = props;
  const editorRef: React.Ref<any> | null = useRef(null);
  const [_isFocus, setFocus] = useState(false);
  const [content, setContent] = useState(initialValue);

  useEffect(() => {
    setContent(initialValue);
    return () => setContent("");
  }, [initialValue]);

  const handleEditorTextChange = (value: any) => {
    cacheEditorContent(value);
    onChange(localStorage.getItem("event-editor"));
  };

  return (
    <EditorWrapper
      className={_isFocus ? "focus" : ""}
      onClick={() => {
        if (editorRef && !_isFocus) {
          editorRef?.current?.focusAtEnd();
        }
      }}
    >
      <Editor
        ref={editorRef}
        defaultValue={initialValue}
        value={content}
        onChange={handleEditorTextChange}
        handleDOMEvents={{
          focus: (_views, _event) => {
            setFocus(true);
            return true;
          },
          blur: (_views, _event) => {
            setFocus(false);
            return true;
          }
        }}
        theme={editorTheme}
      />
    </EditorWrapper>
  );
};
