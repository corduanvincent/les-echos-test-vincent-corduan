import React, { useState } from 'react';
import { useNavigate, Form, redirect, ActionFunction } from 'react-router-dom';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type UserType = 
  | 'USER_WITH_ONE_SUBSCRIPTION' 
  | 'USER_WITH_MULTIPLE_SUBSCRIPTION' 
  | 'USER_WITHOUT_SUBSCRIPTION';
  
export default function FormDialog() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType>("USER_WITHOUT_SUBSCRIPTION");

  interface HandleUserEvent {
    target: {
      value: string;
    };
  }

  const handleUser = (event: HandleUserEvent) => {
    setUser(event.target.value as UserType);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez sélectionner un utilisateur
          </DialogContentText>
          <Form method="post" id="subscription-form">
          <InputLabel id="user-simple-select-label">Utilisateur</InputLabel>
          <Select
            labelId="user-simple-select-label"
            id="user-simple-select"
            value={user}
            label="Utilisateur"
            onChange={handleUser}
            name="user"
          >
            <MenuItem value={"USER_WITH_ONE_SUBSCRIPTION"}>Utilisateur avec une souscription</MenuItem>
            <MenuItem value={"USER_WITH_MULTIPLE_SUBSCRIPTION"}>Utilisateur avec plusieurs souscriptions</MenuItem>
            <MenuItem value={"USER_WITHOUT_SUBSCRIPTION"}>Utilisateur sans souscription</MenuItem>
          </Select>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" form="subscription-form">
              Se connecter
            </Button>
          </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const selectedValue = formData.get("user") as UserType;
  return redirect(`/?user=${selectedValue}`);
};