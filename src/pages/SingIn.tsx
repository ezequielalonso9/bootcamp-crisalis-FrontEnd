import { useContext, useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {  useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';


const theme = createTheme();

type UserAuth = {
  username: string
  password: string
}

type UserCheck = {
  username: boolean
  password: boolean
}


export default function SignIn() {

  const { setToken } = useContext(AuthContext)

  const [invalidAuth, setInvalidAuth] = useState(false);

  const [userAuth, setUserAuth] = useState<UserAuth>({
    username: "",
    password: ""
  })

  const [fieldIsOk, setFieldIsOk] = useState<UserCheck>({
    username: false,
    password: false
  })

  const [isOk, setIsOk] = useState(false)

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    isAllOk()
  }, [userAuth])


  const isAllOk = () => {
    let isAllOk = Object.values(fieldIsOk).every(value => value === true)
    if (isAllOk) {
      setIsOk(true)
    } else {
      setIsOk(false)
    }
  }


  const validateField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {

    if (e.target.value.length <= 0) {
      console.log(`key: ${e.target.name} value.length: ${e.target.value.length}`)
      setFieldIsOk(fieldIsOk => ({
        ...fieldIsOk,
        [e.target.name]: false
      }))
    } else {
      setFieldIsOk(fieldIsOk => ({
        ...fieldIsOk,
        [e.target.name]: true
      }))
    }

  }



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.get("http://localhost:8080/auth", {
      auth: userAuth
    }).then(res => {

      console.log("response")
      console.log(res.data)

      // poner en una funcion setTokenLocalStorage
      localStorage.setItem( "token", res.data )
      setToken(res.data)
      setInvalidAuth( false )
      navigate('/dashboard')

    }).catch((error) => {

      if (error.response.status === 401) {
        setInvalidAuth( true )
        console.log("error.response.status = 401")
      }

    })


  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserAuth({
      ...userAuth,
      [e.target.name]: e.target.value
    })
    validateField(e)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              id="username"
              label="User name"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              disabled={!isOk}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => { setOpen(true) }}>
                  Forgot password or username?
                </Link>
                <Collapse in={open}>
                  <Alert
                    severity='info'
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ m: 2 }}
                  >
                    Please contact the administrator
                  </Alert>
                </Collapse>

                {invalidAuth && <Alert
                  severity='error'
                  sx={{ m: 2 }}
                >
                  Username or password incorrect
                </Alert>}

              </Grid>

            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}