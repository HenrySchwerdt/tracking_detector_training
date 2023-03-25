export class ExtractorUtils {
    static TYPES = [
        "xmlhttprequest",
        "image",
        "font",
        "script",
        "stylesheet",
        "ping",
        "sub_frame",
        "other",
        "main_frame",
        "csp_report",
        "object",
        "media",
    ];

    static FRAME_TYPES = ["outermost_frame", "fenced_frame", "sub_frame"];

    static METHODS = [
        "GET",
        "POST",
        "OPTIONS",
        "HEAD",
        "PUT",
        "DELETE",
        "SEARCH",
        "PATCH",
    ];

    static URL_EXTRACTOR: (url: string) => number[] = (url) => {
        let encoding: number[] = [];
        for (let i = 0; i < url.length; i++) {
            encoding.push((url.charCodeAt(i) % 89) + 1);
        }
        if (encoding.length < 200) {
            encoding = new Array(200 - encoding.length).fill(0).concat(encoding);
        } else if (encoding.length > 200) {
            encoding.splice(0, encoding.length - 200);
        }
        return encoding;
    }

    static FRAME_TYPE_EXTRACTOR: (frameType: string) => number[] = (frameType) => {
        return [ExtractorUtils.FRAME_TYPES.indexOf(frameType) + 1]
    }

    static METHOD_EXTRACTOR: (method: string) => number[] = (method) => {
        return [ExtractorUtils.METHODS.indexOf(method) + 1]
    }

    static TYPE_EXTRACTOR: (type: string) => number[] = (type) => {
        return [ExtractorUtils.TYPES.indexOf(type) + 1]
    }

    static HEADER_REFERRER_EXTRACTOR: (headers: { name: string, value: string }[]) => number[] = (headers) => {
        return [headers.filter((x) => x.name == "Referer").length == 1
            ? 1
            : 0]
    }
}