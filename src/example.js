import * as React from "react";
import { Redirect, Link, Route, Switch, useHistory } from "react-router-dom";

export const Example = () => {
  const history = useHistory();

  return (
    <div>
      <Switch>
        <Route path="/foo">
          <Redirect to="/bar?baz=123#qux" />
        </Route>
        <Route path="/bar">bar route</Route>
        <Route path="/">
          <Link to="/foo">foo</Link>
          <button onClick={() => history.push("/foo")}>foo</button>
        </Route>
      </Switch>
    </div>
  );
};
