import IconTextFormInput from '@/components/form/IconTextFormInput';
import { BsEnvelopeFill } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useSignIn from '../useSignIn';

const SignIn = () => {
  const { control, login, loading } = useSignIn();

  return (
    <form onSubmit={login}>
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
          type="password"
          control={control}
          icon={FaLock}
          placeholder="Password"
          label="Password *"
          name="password"
        />
        <div className="form-text">Your password must be 8 characters at least</div>
      </div>

      <div className="mb-4 d-flex justify-content-between">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Remember me
          </label>
        </div>
        <Link to="/auth/forgot-password" className="text-secondary">
          <u>Forgot password?</u>
        </Link>
      </div>

      <div className="align-items-center mt-0">
        <div className="d-grid">
          <button className="btn btn-primary mb-0" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
