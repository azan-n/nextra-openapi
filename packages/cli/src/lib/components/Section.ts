import { GroupModel } from "redoc";

export function Section(section: GroupModel) {
    const template = `
    # ${section.name}
    ${section.description ? section.description : ''}
    
    ${section.externalDocs ? section.externalDocs : ''}`;

    return template;
}


