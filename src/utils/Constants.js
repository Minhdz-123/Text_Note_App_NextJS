import { validateIcon } from "@/src/hooks/validateIcon";
import { iconMap } from "./Icon";

export const SIDEBAR_MENU = [
  { id: 1, label: "Ghi chú", path: "/", iconKey: "lightbulb" },
  { id: 2, label: "Lời nhắc", path: "/reminders", iconKey: "notification" },
  { id: 3, label: "Chỉnh sửa nhãn", action: "edit_labels", iconKey: "pen" },
  { id: 4, label: "Lưu trữ", path: "/archive", iconKey: "archive" },
  { id: 5, label: "Thùng rác", path: "/trash", iconKey: "trash" },
];

export const NAVBAR_ACTIONS = [
  { id: 1, title: "Làm mới", iconKey: "refresh", action: "refresh" },
  { id: 2, title: "Xem danh sách", iconKey: "viewGrid", action: "view_list" },
  {
    id: 3,
    title: "Cài đặt",
    iconKey: "settings",
    action: "open_dropdown",
    dropdownKey: "SETTING_LIST",
  },
  {
    id: 4,
    title: "Các ứng dụng của Google",
    iconKey: "apps",
    action: "open_dropdown",
    dropdownKey: "APP_LIST",
  },
];

export const SETTING_LIST_ACTION = [
  { id: 1, title: "Cài đặt", action: "setting" },
  { id: 2, title: "Chế độ tối", action: "dark_mode" },
  { id: 3, title: "Gửi ý kiến phản hồi", action: "report" },
  { id: 4, title: "Trợ giúp", action: "help" },
  { id: 5, title: "Ứng dụng đã tải xuống", action: "app_dowloaded" },
  { id: 6, title: "Phím tắt", action: "shortcut" },
];

export const APP_LIST_ACTION = [
  // sau này thêm vào đây
];

export const DROPDOWN_MAP = {
  SETTING_LIST: SETTING_LIST_ACTION,
  APP_LIST: APP_LIST_ACTION,
};

export const NOTE_BOX_BUTTON = [
  { id: 1, title: "Danh sách mới", iconKey: "list", action: "newlist" },
  {
    id: 2,
    title: "Ghi chú mới với bản vẽ",
    iconKey: "paintbrush",
    action: "note_with_draw",
  },
  {
    id: 3,
    title: "Ghi chú mới có hình ảnh",
    iconKey: "picture",
    action: "note_with_picture",
  },
];

export const EDIT_LABELS_TEXT = {
  TITLE: "Chỉnh sửa nhãn",
  PLACEHOLDER_CREATE: "Tạo nhãn mới",
  ERROR_ALREADY_EXISTS: "Nhãn đã tồn tại",
  BUTTON_DONE: "Xong",
  TOOLTIP_DELETE: "Xóa nhãn",
  TOOLTIP_RENAME: "Đổi tên nhãn",
};

export const NOTE_CARD_BUTTON = [
  { id: 0, title: "Sửa", iconKey: "pen", action: "edit_note" },
  {
    id: 1,
    title: "Lựa chọn nền",
    iconKey: "palette",
    action: "choose_background",
  },
  { id: 2, title: "Lưu trữ", iconKey: "storage", action: "move_to_storage" },
  {
    id: 3,
    title: "Tùy chọn khác",
    iconKey: "ellipsis_vertical",
    action: "more_option",
  },
];

export const ARCHIVE_CARD_BUTTON = [
  { id: 0, title: "Sửa", iconKey: "pen", action: "edit_note" },
  { id: 1, title: "Khôi phục", iconKey: "refresh", action: "restore" },
];

validateIcon(iconMap, [
  SIDEBAR_MENU,
  NAVBAR_ACTIONS,
  NOTE_BOX_BUTTON,
  NOTE_CARD_BUTTON,
  ARCHIVE_CARD_BUTTON,
]);
