import React from "react";
import {useAuthenticated} from "./UserContextProvider";

export default function HomeApp(props) {
  const {name} = useAuthenticated();

  return <h1>Welcome {name}</h1>;
}
