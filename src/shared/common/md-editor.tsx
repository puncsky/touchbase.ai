import window from "global/window";
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { loadScript } from "./load-script";

type Props = {
  getSimpleMde(getSimpleMde: any): void;
  initialValue: string;
};

export class MdEditor extends Component<Props> {
  public simplemde: any = null;
  public props: Props;
  public ref: any;

  public componentDidMount(): void {
    const { initialValue, getSimpleMde } = this.props;

    loadScript(
      "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js",
      () => {
        this.simplemde = new window.SimpleMDE({
          element: this.ref,
          autofocus: true,
          initialValue,
          spellChecker: false
        });
        getSimpleMde(this.getSimpleMde);
      }
    );
  }

  public getSimpleMde = () => {
    return this.simplemde;
  };

  public render(): JSX.Element {
    return (
      <div>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"
          />
        </Helmet>
        <textarea
          style={{ display: "none" }}
          ref={ref => (this.ref = ref)}
          defaultValue=""
          placeholder="..."
        />
      </div>
    );
  }
}
