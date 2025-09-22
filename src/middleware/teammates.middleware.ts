import { Teammate } from "@/models/teammate.model.js";

export const getTeammates = async () => {
    const teammates = await Teammate.find({}, 'name title image').sort({ name: 1 }).lean();

    return teammates.map((teammate) => ({
        id: teammate._id,
        name: teammate.name,
        title: teammate.title,
        image: teammate.image
    }));
}