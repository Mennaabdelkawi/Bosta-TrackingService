export const TERMINAL_STATE_TRANSLATION_MAP = new Map([
    ["DELIVERED", "تم التوصيل"],
    ["DELIVERED_TO_SENDER", "تم ارجاعه"],
]);

export const STATUS_MESSAGE_TRANSLATION_MAP = new Map([
    ["DELIVERED", "التاجر طلب استلام الشحنة, سنقوم بالاستلام قريبا"],
    ["DELIVERED_TO_SENDER", "تم إلغاء الأوردر وسوف يتم إرجاعه الي الراسل"],
]);
