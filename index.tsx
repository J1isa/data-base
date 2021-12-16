import "reflect-metadata";
import "lib/connection";

import React, { render } from "preact/compat";

import "./index.sass";

import { Main } from "view/Main";

(() => {
  render((
    <div id="root">
      <Main />
    </div>
  ), document.body)
})()