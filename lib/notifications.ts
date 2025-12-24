import { createNotification } from "@/app/actions/notifications";

export const NotificationEvents = {
    COMMENT: "comment",
    REPLY: "reply",
    RATING: "rating",
    REPORT: "report",
    SUBSCRIPTION: "subscription",
} as const;

export type NotificationEvent =
    (typeof NotificationEvents)[keyof typeof NotificationEvents];

export async function notifyResourceOwner(
    ownerId: string,
    resourceId: string,
    resourceTitle: string,
    actorName: string,
    type: "comment" | "rating" | "report",
    extra?: string
) {
    let message = "";
    switch (type) {
        case "comment":
            message = `${actorName} commented on your resource: ${resourceTitle}`;
            break;
        case "rating":
            message = `${actorName} rated your resource "${resourceTitle}" with ${extra} stars`;
            break;
        case "report":
            message = `Your resource "${resourceTitle}" has been reported for: ${extra}`;
            break;
    }

    return createNotification({
        userId: ownerId,
        eventType: type,
        message,
        link: `/resources/${resourceId}`,
    });
}

export async function notifyCommentAuthor(
    authorId: string,
    resourceId: string,
    resourceTitle: string,
    actorName: string
) {
    return createNotification({
        userId: authorId,
        eventType: "reply",
        message: `${actorName} replied to your comment on: ${resourceTitle}`,
        link: `/resources/${resourceId}`,
    });
}
