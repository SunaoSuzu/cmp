import React from "react";
import BasicLayout from "./component/layout/BasicLayout";
const ErrorPage = ({error}) => {
    return (
        <BasicLayout title={"ERROR"}>
            <h1>{error}</h1>
        </BasicLayout>
    );
}
export default ErrorPage;