import React from "react";
import {
  Button,
  ButtonAlt,
  CloseIcon,
  Container,
  DivisionContainer,
  ModalBox,
  Title,
  GoogleIcon,
  Line,
} from "../ModalLogIn/StyledModalLogIn";
import { Formik, Field, ErrorMessage } from "formik";
import {
  FormContainer,
  InputsContainer,
  Input,
  SubmitContainer,
  CheckBoxContainer,
  Error,
  InputContainer,
  Label,
  Wrapper,
} from "./StyledModalSignUp";
import { useDispatch } from "react-redux";
import { register } from "../../store/actions/userActions";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import axios from "axios";
import { gapi } from "gapi-script";
import { postUser } from "../../store/actions";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const ModalSignUp = ({ isOpenModalSignUp, toggleModalSignUp }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleResetPage = () => {
    setTimeout(() => {
      history.go(0);
    }, 1000);
  };

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "599255604366-6eb57uhcee9ss6dc2h10ceiis7tqhd3k.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

  // const handleGoogleLogin = (response) => {
  //   console.log(response);
  //   console.log(response.profileObj);
  // };

  const handleGoogleLogin = async (googleData) => {
    console.log(googleData);
    console.log(googleData.profileObj);
    try {
      const dataGoogle = await axios.post(
        `https://wixer-server.herokuapp.com/auth/google`,
        {
          tokenId: googleData.tokenId,
          givenName: googleData.profileObj.givenName,
          familyName: googleData.profileObj.familyName,
        }
      );
      const finallyGoogle = await dataGoogle.data;
      localStorage.setItem("userInfo", JSON.stringify(finallyGoogle.usuario));
      handleResetPage();
      //navigate("/home");
    } catch (error) {
      console.log(error.response);
      alert("error no se pudo ingresar", error);
    }
  };
  const logout = (response) => {
    gapi.auth2.getAuthInstance().signOut();
    console.log(response);
    console.log("logout");
  };

  return (
    <>
      {isOpenModalSignUp && (
        <Container>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              username: "",
              email: "",
              password: "",
              dni: "",
              phone: "",
              user_role: "",
            }}
            validate={(values) => {
              const errors = {};

              if (!values.username) {
                errors.username = "Username es requerido";
              } else if (!/^[a-z]{3,}$/i.test(values.username)) {
                errors.username = "username acepta minimo 3 letras";
              }

              if (!values.firstName) {
                errors.firstName = "Nombre es requerido";
              } else if (!/^[a-záéíóúñ\s]{3,}$/i.test(values.firstName)) {
                errors.firstName = "Nombre solo acepta minimo 3 letras";
              }

              if (!values.lastName) {
                errors.lastName = "Apellido es requerido";
              } else if (!/^[a-záéíóúñ\s]{3,}$/i.test(values.lastName)) {
                errors.lastName = "Apellido solo acepta minimo 3 letras";
              }

              if (!values.email) {
                errors.email = "Email es requerido";
              } else if (
                !/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/i.test(
                  values.email
                )
              ) {
                errors.email = "Email no es valido";
              }

              if (!values.password) {
                errors.password = "Contraseña es requerida";
              } else if (
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/i.test(
                  values.password
                )
              ) {
                errors.password =
                  "Min 8 carateres, max 15, al menos una letra mayuscula al menos 1 digito, un caracter especial";
              }
              if (!values.dni) {
                errors.dni = "DNI es requerido";
              }
              if (!values.phone) {
                errors.phone = "Telefono es requerido";
              } else if (
                !/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/i.test(
                  values.phone
                )
              ) {
                errors.phone = "Numero de telefono no valido, solo 10 numeros";
              }

              if (!values.user_role) {
                errors.user_role = "Es obligatorio elegir un tipo de usuario";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(false);
              dispatch(register(values));
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Formulario completado con exito!',
                text: 'Verifique su email para confirmar su cuenta.',
                showConfirmButton: false,
                timer: 30000
              })
              toggleModalSignUp();
            }}
          >
            {(isSubmitting) => (
              <FormContainer>
                <CloseIcon onClick={toggleModalSignUp} />
                <h2>Crear nueva cuenta</h2>
                <InputsContainer>
                  <div>
                    <InputContainer>
                      <Label>Username</Label>
                      <Input name="username" type="text" />
                      <ErrorMessage name="username" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                    </InputContainer>
                    <InputContainer>
                      <Label>Nombre</Label>
                      <Input name="firstName" type="text" />
                      <ErrorMessage name="firstName" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                      <InputContainer>
                        <Label>Apellido</Label>
                        <Input name="lastName" type="text" />
                        <ErrorMessage name="lastName" component="div">
                          {(msg) => <Error>{msg}</Error>}
                        </ErrorMessage>
                      </InputContainer>
                    </InputContainer>

                    <InputContainer>
                      <Label>Rol de usuario</Label>
                      <Field
                        component="select"
                        name="user_role"
                        className="field-select"
                      >
                        <option>Elige tu rol</option>
                        <option value="user">User</option>
                        <option value="worker">Worker</option>
                      </Field>
                      <ErrorMessage name="user_role" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                    </InputContainer>
                  </div>
                  <div>
                    <InputContainer>
                      <Label>Email</Label>
                      <Input name="email" type="email" />
                      <ErrorMessage name="email" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                    </InputContainer>
                    <InputContainer>
                      <Label>Contraseña</Label>
                      <Input name="password" type="password" />
                      <ErrorMessage name="password" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                    </InputContainer>
                    <InputContainer>
                      <Label>Telefono</Label>
                      <Input name="phone" />
                      <ErrorMessage name="phone" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                    </InputContainer>

                    <InputContainer>
                      <Label>DNI</Label>
                      <Input name="dni" type="text" />
                      <ErrorMessage name="dni" component="div">
                        {(msg) => <Error>{msg}</Error>}
                      </ErrorMessage>
                    </InputContainer>
                  </div>
                  <div></div>
                </InputsContainer>
                <SubmitContainer>
                  <CheckBoxContainer>
                    {/* <Field type="checkbox" />I agree with terms and conditions */}
                  </CheckBoxContainer>
                  <Button type="submit">Submit</Button>
                  <DivisionContainer>
                    <Line />
                    Or
                    <Line />
                  </DivisionContainer>

                  <GoogleLogin
                  clientId="599255604366-6eb57uhcee9ss6dc2h10ceiis7tqhd3k.apps.googleusercontent.com"
                  onSuccess={handleGoogleLogin}
                  onFailure={handleGoogleLogin}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <ButtonAlt  onClick={renderProps.onClick}
                    disabled={renderProps.disabled}>
                      <GoogleIcon />
                      Continuar con Google
                    </ButtonAlt>
                  )}
                />

                  {/* <GoogleLogin
                    // clientId={clientGoogle}
                    // onSuccess={handleGoogleLogin}
                    // onFailure={handleGoogleLogin}
                    render={(renderProps) => (
                      <ButtonAlt disabled={true}>
                        <GoogleIcon
                        // onClick={renderProps.onClick}
                        // disabled={renderProps.disabled}
                        />
                        Crear con Google
                      </ButtonAlt>
                      // <ButtonGoogle
                      //   onClick={renderProps.onClick}
                      //   disabled={renderProps.disabled}
                      // >
                      //   <FcGoogle
                      //     style={{
                      //       width: "33px",
                      //       height: "33px",
                      //       marginTop: "6px",
                      //     }}
                      //   />
                      // </ButtonGoogle>
                    )}
                  /> */}
                  {/* <ButtonAlt disabled={true}>
                    <GoogleIcon />
                    Crear con Google
                  </ButtonAlt> */}
                </SubmitContainer>
              </FormContainer>
            )}

            {/* <ModalBox>
              <Title>Create New Account</Title>
              <InputContainer>
                <Input placeholder="Name" />
              </InputContainer>
              <InputContainer>
                <Input placeholder="Email" />
              </InputContainer>
              <InputContainer>
                <Input placeholder="Password" />
              </InputContainer>
              <CloseIcon onClick={toggleModalSignUp} />
              <CheckBoxContainer>
                <input type="checkbox" />I agree with Terms & Conditions
              </CheckBoxContainer>
              <Button>Create New Account</Button>
              <Field component="select">
                <option value="">1</option>
                <option value="">2</option>
              </Field>
              <DivisionContainer>
                <Line />
                Or
                <Line />
              </DivisionContainer>
              <ButtonAlt>
                <GoogleIcon />
                Create with Google
              </ButtonAlt>
            </ModalBox> */}
          </Formik>
        </Container>
      )}
    </>
  );
};

export default ModalSignUp;
