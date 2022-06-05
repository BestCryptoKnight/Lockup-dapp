import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/material';

export default function ImagePopup(props: {isOpen: boolean, onClose: ()=>void, uri: string}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(()=>{
      setOpen(props.isOpen);
  },[props.isOpen])

  const handleClose = () => {
    props.onClose();
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
            style: {
                boxShadow: '#26b8e9 0px 0 20px 0px',
                transition: 'all 0.3s ease-in',
                transform: 'scale(1)',
            },
        }}
      >
        <Box className="card-view-container" component="img" src={props.uri} width="300px" height="300px" borderRadius={'8px'} />
      </Dialog>
    </div>
  );
}