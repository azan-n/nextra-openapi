import { MediaContentModel } from "redoc";
import { TabsMdx } from "./Tabs";


export function MediaTypesSwitch(content: MediaContentModel, children: (string | null)[]) {
    // Create a tab for every media type
    const mediaTypes = content.mediaTypes.map((mediaType) => { return mediaType.name });
    return TabsMdx(mediaTypes, children);
}