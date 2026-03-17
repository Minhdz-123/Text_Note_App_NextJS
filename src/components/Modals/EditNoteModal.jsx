import NoteEditor from "../Commons/NoteEditor";
import { NOTE_PROPERTIES } from "@/src/utils/Constants";
import BaseModal from "../Commons/BaseModal";

const EditNoteModal = ({ isOpen, onClose, note, onSave }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="w-150 p-0 overflow-hidden"
      showFooter={false}
      bodyClassName=""
    >
      <NoteEditor
        key={note?.id}
        initialTitle={note?.title}
        initialContent={note?.content}
        initialColorClass={note?.[NOTE_PROPERTIES.COLOR_CLASS]}
        initialFormats={note?.[NOTE_PROPERTIES.FORMATS]}
        timestamp={note?.id}
        showTimestamp={true}
        onSave={(updatedData) => {
          onSave({ ...note, ...updatedData });
        }}
        onCancel={onClose}
      />
    </BaseModal>
  );
};

export default EditNoteModal;
