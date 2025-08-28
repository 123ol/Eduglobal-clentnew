import IconTextFormInput from '@/components/form/IconTextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { BsEnvelopeFill } from 'react-icons/bs';
import * as yup from 'yup';
const ForgotPassword = () => {
  const editEmailFormSchema = yup.object({
    email: yup.string().email('Please enter valid email').required('Please enter your Email')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(editEmailFormSchema)
  });
  return <form onSubmit={handleSubmit(() => {})}>
      <div className="mb-4">
        <IconTextFormInput control={control} icon={BsEnvelopeFill} placeholder="E-mail" label="Email address *" name="email" />
      </div>
      <div className="align-items-center">
        <div className="d-grid">
          <button className="btn btn-primary mb-0" type="submit">
            Reset password
          </button>
        </div>
      </div>
    </form>;
};
export default ForgotPassword;
