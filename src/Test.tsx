import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Grid,
} from '@mui/material';

// Define the Zod schema for validation
const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

// Infer the type from the Zod schema
type LoginFormInputs = z.infer<typeof LoginFormSchema>;

// Define props interface for the component
interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void;
  isLoading?: boolean; // Optional prop for loading state during submission
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    // In a real application, you might handle an API call here.
    // For this example, we just pass it to the parent component's onSubmit prop.
    onSubmit(data);
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        sx={{
          mt: 3,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login Form
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              id="email"
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              aria-invalid={errors.email ? "true" : "false"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('password')}
              label="Password"
              type="password" // Corrected type for password field
              id="password"
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              aria-invalid={errors.password ? "true" : "false"}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginForm;
