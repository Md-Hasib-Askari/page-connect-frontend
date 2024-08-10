export interface IChatRecipientListProps {
    recipient: {
        id: string;
        name: string;
        profileImage: string;
    }
    lastMessage: {
        message: string;
        createdTime: string;
    }
}