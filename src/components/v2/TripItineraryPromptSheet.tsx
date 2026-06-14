import { EnteBottomSheet } from "../EnteBottomSheet";
import { EnteButton } from "../EnteButton";

type Props = {
  open: boolean;
  onClose: () => void;
  onPreview?: () => void;
};

export function TripItineraryPromptSheet({ open, onClose, onPreview }: Props) {
  return (
    <EnteBottomSheet
      open={open}
      title="Looks like you went on a trip!"
      message="Ente can create a journey from the photos in this album and make it easy to share with everyone who was part of it"
      onClose={onClose}
      actions={
        <>
          <EnteButton label="Preview journey" onClick={onPreview ?? onClose} />
          <EnteButton label="Maybe later" variant="secondary" onClick={onClose} />
        </>
      }
    />
  );
}
