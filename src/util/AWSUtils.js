import React from "react";

export function getName(tags) {
    let retVal = "";
    tags.map(tag => {
        if (tag.Key === "Name") {
            retVal = tag.Value;
        }
    });
    return retVal;
}
