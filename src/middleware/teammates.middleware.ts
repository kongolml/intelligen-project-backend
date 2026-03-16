import { Teammate } from "@/models/teammate.model.js";

// middleware
import { prepareMediaFileForResponse } from './media-file.middleware.js';

// helpers
import { getMediaUrl } from '../helpers/url.js';

const prepareTeammateForResponse = (teammates: any) => {
    return teammates.map((teammate) => ({
        id: teammate._id,
        name: teammate.name,
        title: teammate.title,
        image: teammate.image.map(prepareMediaFileForResponse)
    }));
}

export const getTeammates = async () => {
    const teammates = await Teammate.find({}, 'name title image').sort({ name: 1 })
        .populate({
            path: 'image',
            select: 's3Key bucket',
            transform: (doc: any) =>
            doc
                ? {
                    id: doc._id.toString(),
                    url: getMediaUrl(doc.bucket, doc.s3Key),
                }
                : null,
        }).lean();

    return prepareTeammateForResponse(teammates);
}