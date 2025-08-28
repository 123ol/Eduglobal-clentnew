import IconTextFormInput from '@/components/form/IconTextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { BsEnvelopeFill } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';
import * as yup from 'yup';

const SignUpForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const editEmailFormSchema = yup.object({
    name: yup.string().required('Please enter your Name'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your Email'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10,15}$/, 'Please enter a valid phone number')
      .required('Please enter your Phone Number'),
    password: yup.string().required('Please enter your Password'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your Password'),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(editEmailFormSchema),
  });

  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      };
      const url = 'http://localhost:5000/api/auth/register';
      console.log('Request URL:', url);
      console.log('Request Payload:', payload);
      const res = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });
      console.log('Response:', res.data);

      if (res.data.token) {
        alert('Registration successful!');
        localStorage.setItem('token', res.data.token);
        navigate('/auth/sign-in'); // Redirect to login page
      } else {
        throw new Error('No token returned from the server');
      }
    } catch (error) {
      console.error('Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
      alert(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <IconTextFormInput
          control={control}
          icon={BsEnvelopeFill}
          placeholder="Name"
          label="Name *"
          name="name"
        />
      </div>

      <div className="mb-4">
        <IconTextFormInput
          control={control}
          icon={BsEnvelopeFill}
          placeholder="E-mail"
          label="Email address *"
          name="email"
        />
      </div>

      <div className="mb-4">
        <IconTextFormInput
          control={control}
          icon={FaPhone}
          placeholder="Phone Number"
          label="Phone Number *"
          name="phoneNumber"
        />
      </div>

      <div className="mb-4">
        <IconTextFormInput
          control={control}
          icon={FaLock}
          placeholder="*********"
          label="Password *"
          name="password"
        />
      </div>

      <div className="mb-4">
        <IconTextFormInput
          control={control}
          icon={FaLock}
          placeholder="*********"
          label="Confirm Password *"
          name="confirmPassword"
        />
      </div>

      <div className="mb-4">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="checkbox-1" />
          <label className="form-check-label" htmlFor="checkbox-1">
            By signing up, you agree to the <a href="#">terms of service</a>
          </label>
        </div>
      </div>

      <div className="align-items-center mt-0">
        <div className="d-grid">
          <button className="btn btn-primary mb-0" type="submit">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;