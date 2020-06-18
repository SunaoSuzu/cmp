import React from "react";
import {useAuthenticateInfo} from "./UserContextProvider";

export default function HomeApp(props) {
  const {name} = useAuthenticateInfo();

  return <h1>Welcome {name}</h1>;
}
