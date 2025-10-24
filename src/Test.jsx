import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

// MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Define your Zod schema
const LoginFormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

// Define your form data type (using JSDoc for type hinting in JS)
/**
 * @typedef {z.infer<typeof LoginFormSchema>} LoginFormInputs
 */

/**
 * LoginForm component for user authentication.
 *
 * @param {object} props
 * @param {(data: LoginFormInputs) => void} [props.onSubmit] - Callback function when the form is submitted successfully.
 */
const LoginForm = ({onSubmit = (data) => console.log('Form submitted:', data)}) => {
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                }}
            >
                <Typography component="h1" variant="h5">
                    Login Form
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate // Disable browser's default HTML validation
                    sx={{mt: 3}}
                >
                    <Grid container spacing={2}> {/* spacing={2} from schema */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Email"
                                type="email"
                                autoComplete="email"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="password"
                                label="Password"
                                type="password" // Use type "password" for security, overriding schema's "text"
                                autoComplete="current-password"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{mt: 1, mb: 2}}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
