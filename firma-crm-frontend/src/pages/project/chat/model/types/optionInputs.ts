import { OptionInput } from "./chatOptions";

export const options: OptionInput[] = [
    {
        label: "Автоматическое сообщение",
        key: "autoMessageText",
        helperText:
            "Сообщение, которое автоматически напишется клиенту в чате через определенное время",
    },
    {
        label: "Задержка перед отображением автоматического сообщения",
        key: "autoMessageDelay",
        type: "number",
        leftAddon: "Секунд",
    },
    {
        label: "Заголовок в закрытом виде",
        key: "headerTitleCloseText",
        helperText:
            "Заголовок в шапке чата который отображается при закрытом чате",
    },
    {
        label: "Заголовок в открытом виде",
        key: "headerTitleOpenText",
        helperText:
            "Заголовок в шапке чата который отображается при открытом чате",
    },
    {
        label: "Подзаголовок",
        key: "headerSubtitleText",
        helperText: "Подзаголовок, который отображается при открытом чате",
    },
    {
        label: "Сообщение, отображения процесса подключения менеджера",
        key: "connectingMessageText",
        helperText:
            "Сообщение, которое пишется, когда идет процесс подключения менеджера",
    },
    {
        label: "Сообщение, отображения просьбы ждать звонка",
        key: "finalMessageText",
        helperText:
            "Сообщение которое отображается после сообщения о процессе подключения менеджера. Просьба ждать звонка",
    },
    {
        label: "Отступ справа от края экрана",
        key: "rightOffset",
        leftAddon: "%, px, em",
    },
];
