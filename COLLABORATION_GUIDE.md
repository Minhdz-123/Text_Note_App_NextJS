# Tài liệu Chuyên sâu: Cơ chế Cộng tác Thời gian thực (Collaboration Deep Dive)

Tài liệu này giải thích chi tiết từng dòng code, luồng thực thi và cách dữ liệu được luân chuyển giữa các thành phần trong hệ thống.

---

## 1. Vòng đời của một Phiên Cộng tác (Life Cycle)

Khi bạn mở trang `/test-collaboration` hoặc trang `/share/[shareId]`, hệ thống sẽ chạy qua các bước sau theo thứ tự:

### Bước 1: Khởi tạo (Mounting)
1.  **`NoteEditorCollab.jsx`** được render. Nó nhận các Props như `noteId`, `initialContent`, `yjsSnapshot`.
2.  Bên trong, một `Y.Doc` mới được tạo (`new Y.Doc()`). Đây là đối tượng rỗng ban đầu.
3.  Nếu có `yjsSnapshot` (dữ liệu cũ từ Firebase), hệ thống sẽ giải mã Base64 -> Uint8Array và nạp vào `Y.Doc` bằng hàm `Y.applyUpdate`.

### Bước 2: Thiết lập Kết nối (Signaling & P2P)
1.  **`WebrtcProvider`** được khởi tạo với tên phòng là `note-room-[id]`.
2.  Nó gửi tín hiệu qua các máy chủ trung gian (Signaling Servers) để tìm các "Peers" (những người khác cùng ID phòng).
3.  Khi tìm thấy nhau, các máy tính tự kết nối trực tiếp (P2P). Từ giây phút này, mọi thay đổi sễ được trao đổi trực tiếp giữa các trình duyệt.

### Bước 3: Soạn thảo (Interacting)
1.  **Tiptap Editor** được khởi tạo và "buộc" vào `Y.Doc` thông qua extension `Collaboration`.
2.  Khi bạn gõ chữ "H":
    - Tiptap cập nhật View.
    - `Collaboration Extension` nhận biết và cập nhật vào `Y.XmlFragment` của Yjs.
    - Yjs phát ra sự kiện `update`.
    - `WebrtcProvider` lấy gói tin "update" đó gửi đi cho các bạn bè.

---

## 2. Chi tiết Luồng Dữ liệu & Lưu trữ (Data Persistence)

Đây là phần phức tạp nhất vì chúng ta có 2 loại người dùng: **Chủ phòng (Host)** và **Khách (Guest)**.

### Tại sao phải lưu Snapshot (Base64)?
Yjs không chỉ lưu văn bản, nó lưu cả "Lịch sử biến đổi" để giải quyết xung đột. Nếu chỉ lưu Plain Text (`"Hello World"`) lên Firebase, khi người thứ 2 mở máy, Yjs của họ sẽ không biết lịch sử trước đó và có thể gây ra lỗi chèn đè.
Do đó, chúng ta lưu **Binary Update** (Snapshot) - một bản sao toàn bộ bộ não của Yjs.

### Quy trình lưu dữ liệu (Save Flow):
Hàm `handleUpdate` trong `useCollabEditor.jsx` đóng vai trò là "người gác cổng":

```javascript
// Sau khi ngừng gõ 3 giây (debounce)
const handleUpdate = () => {
  const content = editor.getHTML(); // Lấy HTML để hiển thị nhanh
  const snapshotStr = Array.from(Y.encodeStateAsUpdate(ydoc))
    .map((c) => String.fromCharCode(c))
    .join(""); // Chuyển Binary Yjs sang String tạm
  const snapshotBase64 = window.btoa(snapshotStr); // Mã hóa Base64 để lưu vào DB
  
  // Gọi callback onSaveDebounced truyền dữ liệu ra ngoài
  onSaveDebounced({ content, yjsSnapshot: snapshotBase64 });
};
```

1.  **Ở trang Test Lab**: Callback này gọi `dispatch(editNote)` để lưu vào Redux của bạn. Sau đó `useFirebaseSync` sẽ đẩy từ Redux lên thư mục `/users/{uid}` của bạn.
2.  **Ở trang Chia sẻ (Guest)**: Callback gọi `updateSharedNote` để đẩy dữ liệu lên collection `sharedNotes` trên Firebase.

---

## 3. Phân tích các File Code chính (Code Walkthrough)

### 📂 `src/hooks/useCollabEditor.jsx`
- **Mục đích**: Quản lý logic gõ chung (Logic Layer).
- **Hàm `useEditor`**: Thiết lập Tiptap. Quan trọng nhất là `onUpdate` của Tiptap sẽ không được dùng trực tiếp cho việc lưu, mà chúng ta dùng sự kiện `update` của chính `Y.Doc` để đảm bảo lưu đúng trạng thái CRDT.
- **Biến `awareness`**: Quản lý con trỏ (Cursor) của người dùng khác. Nó cho bạn biết ai đang gõ ở đâu và tên họ là gì.

### 📂 `src/components/features/notes/NoteEditorCollab.jsx`
- **Mục đích**: Giao diện và thanh công cụ (UI Layer).
- **Cấu hình `signalingUrls`**: Đây là danh sách các máy chủ "môi giới" để các trình duyệt tìm thấy nhau. Nếu một cái chết, cái khác sẽ thay thế.

---

## 4. Thứ tự Thực thi Code (Execution Trace)

1.  **User A** truy cập link chia sẻ.
2.  `app/share/[shareId]/page.jsx` chạy -> Lấy `shareId` từ URL.
3.  `useEffect` của trang Share tải dữ liệu từ Firestore (`sharedNotes`).
4.  Dữ liệu (bao gồm `yjsSnapshot`) được truyền vào `NoteEditorCollab`.
5.  `useCollabEditor` nhận `yjsSnapshot`, chạy `Y.applyUpdate(ydoc, binary)`. Nội dung cũ hiện ra.
6.  `WebrtcProvider` kết nối.
7.  **User A** gõ chữ -> `handleUpdate` chạy sau 3 giây.
8.  `updateSharedNote` chạy -> Gửi Base64 Snapshot lên Firebase.
9.  **User B** (Chủ phòng) đang mở ghi chú đó ở trang chủ -> `EditNoteModal` có `onSnapshot` lắng nghe.
10. `onSnapshot` thấy `sharedNotes` thay đổi -> Tự động cập nhật vào Redux của Chủ phòng.

---

## 5. Các thuật ngữ cần biết (Glossary)

- **CRDT**: Công nghệ toán học giúp tự động gộp các thay đổi từ nhiều người mà không bị mất dữ liệu.
- **Y.Doc**: Bản thảo số của Yjs.
- **Uint8Array**: Kiểu dữ liệu nhị phân (Binary) mà Yjs sử dụng để đạt hiệu suất cao.
- **Awareness**: "Sự nhận biết" về những người khác trong phòng (ai đang online, chuột đang ở đâu).
- **Signaling Server**: "Người đưa tin" giúp các trình duyệt trao đổi địa chỉ IP với nhau trước khi kết nối trực tiếp.

---
*Tài liệu này giúp bạn nắm bắt bản chất của hệ thống. Nếu muốn sửa lỗi gõ chung, hãy tập trung vào `useCollabEditor.jsx`. Nếu muốn sửa lỗi lưu trữ, hãy xem `useFirebaseSync.js`.*
