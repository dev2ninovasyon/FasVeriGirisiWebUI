import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";

interface TamamlaPopUpProps {
  isTamamlaPopUp: boolean;
  handleClose: () => void;
  handleTamamla: () => void;
}

export const TamamlaPopUp: React.FC<TamamlaPopUpProps> = ({
  isTamamlaPopUp,
  handleClose,
  handleTamamla,
}) => {
  return (
    <Dialog maxWidth={"lg"} open={isTamamlaPopUp} onClose={handleClose}>
      <DialogContent className="testdialog">
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography variant="h5">
            Tamamlamak istediğinize emin misiniz?
          </Typography>
        </Stack>
      </DialogContent>
      <DialogContent>
        <Box py={1}>
          <Typography variant="body1">
            Bu işlemin ardından bağlantıya tekrar ulaşamazsınız. Son halini
            kaydetmiş olduğunuzdan emin olun.
          </Typography>
        </Box>
        <Box py={1}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              handleTamamla();
              handleClose();
            }}
            sx={{ width: "100%", mb: 1 }}
          >
            Evet, Tamamla
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleClose()}
            sx={{ width: "100%" }}
          >
            Hayır, İptal Et
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
