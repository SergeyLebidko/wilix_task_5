import {TTag} from '../../types';

function getTagUniqueTextList(tags: TTag[]): string[] {
    const result: string[] = [];
    tags.forEach(tag => {
        if (!result.some(text => text.toLowerCase() === tag.text.toLowerCase())) {
            result.push(tag.text);
        }
    });
    result.sort();
    return result;
}

export default getTagUniqueTextList;
