
export function getName(tags) {
    const name = tags.find(tag => tag.Key === "Name");
    if(name===null)return null;
    return name.Value;
}
