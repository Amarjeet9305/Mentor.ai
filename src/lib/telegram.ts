export const sendTelegramMessage = async (telegramId: string, message: string) => {
    const rawToken = process.env.TELEGRAM_BOT_TOKEN || "";
    const token = rawToken.trim();
    
    if (!token) {
        console.log(`Telegram Bot token not set. Skipping message to ${telegramId}`);
        return;
    }

    const safeId = telegramId.trim();
    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: safeId,
                text: message,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Telegram API Error ${response.status}: ${errorData}`);
        }
        
        console.log(`Telegram message sent to ${safeId}`);
    } catch (error) {
        console.error(`Failed to send Telegram message to ${safeId}:`, error);
    }
};
