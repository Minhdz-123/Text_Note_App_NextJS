export const SIDEBAR_MENU = [
  { id: 1, label: "Ghi chú", path: "/", icon: "lightbulb" },
  { id: 2, label: "Lời nhắc", path: "/reminders", icon: "notification" },
  { id: 3, label: "Chỉnh sửa nhãn", action: "edit_labels", icon: "pen" },
  { id: 4, label: "Lưu trữ", path: "/archive", icon: "archive" },
  { id: 5, label: "Thùng rác", path: "/trash", icon: "trash" },
];
export const NAVBAR_ACTIONS = [
  { id: 1, title: "Làm mới", iconKey: "refresh", action: "refresh" },
  { id: 2, title: "Xem danh sách", iconKey: "viewGrid", action: "view_list" },
  { id: 3, title: "Cài đặt", iconKey: "settings", action: "settings" },
  // có thể set action của 3 và 4 giống nhau để cùng là sử dụng hàm mở ra 1 cái list được truyền vào
  {
    id: 4,
    title: "Các ứng dụng của Google",
    iconKey: "apps",
    action: "view_app",
  },
];
export const SETTING_LIST_ACTION = [
  {
    id: 1,
    title: "Cài đặt",
    action: "setting",
  },
  {
    id: 2,
    title: "Chế độ tối",
    action: "dark_mode",
  },
  {
    id: 3,
    title: "Gửi ý kiến phản hồi",
    action: "report",
  },
  {
    id: 4,
    title: "Trợ giúp",
    action: "help",
  },
  {
    id: 5,
    title: "Ứng dụng đã tải xuống",
    action: "app_dowloaded",
  },
  {
    id: 6,
    title: "Phím tắt",
    action: "shortcut",
  },
];
export const NOTE_BOX_BUTTON = [
  { id: 1, title: "Danh sách mới", iconKey: "list", action: "newlist" },
  {
    id: 2,
    title: "Ghi chú mới với bản vẽ",
    iconKey: "paintbrush",
    action: "note_with_draw",
  },
  {
    id: 3,
    title: "Ghi chú mới có hình ảnh",
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
