import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export interface AlertDialogProps {
  title: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
  onAgree : () => void
}



export function AlertDialog({title, message, visible, setVisible,  onAgree}: AlertDialogProps ) {

  const handleClose = () => {
    setVisible(false)
  };

  const handleDisagree = () => {
    handleClose()
  }

  const handleAgree = () => {
    handleClose()
    onAgree()
  }

  return (
    <div>
      {/* eliminar boton si se va a controlar desde afuera */}

      <Dialog
        open={visible}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>Canelar</Button>
          <Button onClick={handleAgree} autoFocus>
           Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}