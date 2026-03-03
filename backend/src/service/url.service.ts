import nanoid from "nanoid";

export const generateShortId = async() => {
    const shortId = await nanoid.nanoid(7);
    console.log(shortId);
    return shortId;
}

