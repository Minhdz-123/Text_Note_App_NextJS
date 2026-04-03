import { validateIcon } from "@/src/utils/validateIcon";
import { iconMap } from "./Icon";

export const SIDEBAR_MENU = [
  { id: 1, label: "Ghi chú", path: "/", iconKey: "lightbulb" },
  { id: 2, label: "Lời nhắc", path: "/reminders", iconKey: "notification" },
  { id: 3, label: "Chỉnh sửa nhãn", action: "edit_labels", iconKey: "pen" },
  { id: 4, label: "Lưu trữ", path: "/archive", iconKey: "archive" },
  { id: 5, label: "Thùng rác", path: "/trash", iconKey: "trash" },
  { id: 6, label: "Lời mời", path: "/test-collaboration/invitations", iconKey: "userPlus" },
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
  TOOLTIP_CREATE: "Tạo nhãn mới",
  TOOLTIP_CANCEL: "Hủy",
  TOOLTIP_SAVE: "Lưu",
  TOOLTIP_ADD: "Tạo nhãn",
};

export const EDIT_NOTE_TEXT = {
  PLACEHOLDER_TITLE: "Tiêu đề",
  PLACEHOLDER_CONTENT: "Ghi chú...",
  TOOLTIP_SAVE: "Lưu",
  TIMESTAMP_PREFIX: "Đã gửi vào",
};

export const SHARE_NOTE_TEXT = {
  TITLE: "Chia sẻ ghi chú",
  TOGGLE_LABEL: "Chia sẻ công khai",
  COPY_BUTTON: "Sao chép liên kết",
  COPIED_SUCCESS: "Đã sao chép liên kết!",
  CLOSE_BUTTON: "Đóng",
};

export const SHORTCUT_MODAL_TEXT = {
  TITLE: "Phím tắt",
  TOOLTIP_CLOSE: "Đóng",
};

export const NOTE_CARD_BUTTON = [
  { id: 0, title: "Sửa", iconKey: "pen", action: "edit_note" },
  {
    id: 1,
    title: "Các tùy chọn định dạng",
    iconKey: "font",
    action: "choose_format",
  },
  {
    id: 2,
    title: "Lựa chọn nền",
    iconKey: "palette",
    action: "choose_background",
  },
  { id: 3, title: "Lưu trữ", iconKey: "storage", action: "move_to_storage" },
  {
    id: 4,
    title: "Tùy chọn khác",
    iconKey: "ellipsis_vertical",
    action: "more_option",
  },
  { id: 5, title: "Chia sẻ", iconKey: "share", action: "share_note" },
];

export const ARCHIVE_CARD_BUTTON = [
  { id: 0, title: "Sửa", iconKey: "pen", action: "edit_note" },
  {
    id: 1,
    title: "Các tùy chọn định dạng",
    iconKey: "font",
    action: "choose_format",
  },
  {
    id: 2,
    title: "Lựa chọn nền",
    iconKey: "palette",
    action: "choose_background",
  },
  { id: 3, title: "Khôi phục", iconKey: "refresh", action: "restore" },
  {
    id: 4,
    title: "Tùy chọn khác",
    iconKey: "ellipsis_vertical",
    action: "more_option",
  },
  { id: 5, title: "Chia sẻ", iconKey: "share", action: "share_note" },
];

export const TRASH_CARD_BUTTON = [
  {
    id: 0,
    title: "Khôi phục",
    iconKey: "refresh",
    action: "restore_from_trash",
  },
  {
    id: 1,
    title: "Xóa vĩnh viễn",
    iconKey: "trash",
    action: "delete_permanently",
  },
];

export const MORE_OPTION_MENU = [
  { id: 1, label: "Thêm nhãn", action: "add_labels" },
  { id: 2, label: "Xóa ghi chú", action: "move_to_trash" },
];
export const COLOR_PALETTE = [
  { id: 1, name: "Trắng", colorClass: "bg-white" },
  { id: 2, name: "Đỏ", colorClass: "bg-red-300" },
  { id: 4, name: "Vàng", colorClass: "bg-yellow-200" },
  { id: 5, name: "Xanh lá", colorClass: "bg-green-100" },
  { id: 6, name: "Xanh dương", colorClass: "bg-cyan-100" },
  { id: 7, name: "Tím", colorClass: "bg-blue-100" },
];
export const FONT_TYPES = [
  {
    id: 1,
    name: "Tiêu đề 1",
    type: "h1",
    iconKey: "heading1",
    display: { label: "H1", style: "font-bold" },
  },
  {
    id: 2,
    name: "Tiêu đề 2",
    type: "h2",
    iconKey: "heading2",
    display: { label: "H2", style: "font-bold" },
  },
  {
    id: 3,
    name: "Bình thường",
    type: "p",
    iconKey: "text",
    display: { label: "Aa" },
  },
  {
    id: 4,
    name: "In đậm",
    type: "strong",
    iconKey: "bold",
    display: { label: "B", style: "font-bold" },
  },
  {
    id: 5,
    name: "In nghiêng",
    type: "em",
    iconKey: "italic",
    display: { label: "I", style: "italic" },
  },
  {
    id: 6,
    name: "Gạch dưới",
    type: "u",
    iconKey: "underline",
    display: { label: "U", style: "underline" },
  },
  {
    id: 7,
    name: "Xóa định dạng",
    type: "default",
    iconKey: "clearFormat",
    display: { useIcon: true },
  },
];

export const FORMAT_CONFIG = {
  h1: { tag: "h1", classes: "text-2xl font-bold" },
  h2: { tag: "h2", classes: "text-xl font-bold" },
  p: { tag: "p", classes: "" },
  strong: { tag: null, classes: "font-bold" },
  em: { tag: null, classes: "italic" },
  u: { tag: null, classes: "underline" },
};

export const HEADING_TYPES = Object.keys(FORMAT_CONFIG)
  .filter((key) => FORMAT_CONFIG[key].tag !== null)
  .filter((key) => ["h1", "h2", "p"].includes(key));

export const STORAGE_KEYS = {
  NOTES: "my_notes_list",
  ARCHIVED: "archived_notes",
  TRASH: "trash_notes",
};

export const NOTE_PROPERTIES = {
  FORMATS: "formats",
  COLOR_CLASS: "colorClass",
  LABELS: "labels",
};

export const COLLAB_TEXT = {
  CAPTAIN_BADGE: "Captain",
  CAPTAIN_ELECTED:
    "Bạn đã được bầu làm Captain — dữ liệu sẽ được đồng bộ qua bạn",
  CAPTAIN_LEFT:
    "Captain đã rời phòng — có thể có thay đổi chưa được lưu",
  SYNCING_BY: "Đồng bộ bởi",
  ONLINE_SUFFIX: "người đang xem",
  CONNECTING_ROOM: "Đang kết nối phòng...",
  DEFAULT_USER_NAME: "Anonymous",
  CLOSE_BUTTON: "Đóng",
};

export const INVITATION_TEXT = {
  TITLE: "Gửi lời mời cộng tác",
  PLACEHOLDER_EMAIL: "Nhập email cộng tác viên...",
  BUTTON_SEND: "Gửi mời",
  SUCCESS_SENT: "Đã gửi lời mời thành công!",
  ERROR_NOT_FOUND: "Không tìm thấy người dùng với email này.",
  ERROR_SELF: "Bạn không thể tự mời chính mình.",
  ERROR_GENERIC: "Lỗi gửi lời mời.",
  ERROR_ALREADY_INVITED: "Bạn đã gửi lời mời cho người dùng này rồi.",
  SIDEBAR_TITLE: "Lời mời",
  EMPTY: "Chưa có lời mời",
  ACCEPT: "Chấp nhận",
  DECLINE: "Từ chối",
  ACCEPTED_MSG: "Tham gia phòng!",
};

validateIcon(iconMap, [
  SIDEBAR_MENU,
  NAVBAR_ACTIONS,
  NOTE_BOX_BUTTON,
  NOTE_CARD_BUTTON,
  ARCHIVE_CARD_BUTTON,
  TRASH_CARD_BUTTON,
  FONT_TYPES,
]);
