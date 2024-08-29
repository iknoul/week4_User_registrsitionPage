
import { useRouter } from 'next/router';
import { useEffect, ReactElement } from 'react';
import { decodeToken } from '@/utils/decodeToken'; // Adjust the path as needed

type PrivateRouterProps = {
  requiredSteps: { [key: string]: string };
  children: ReactElement;
};

const PrivateRouter: React.FC<PrivateRouterProps> = ({ requiredSteps, children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('registrationToken');

    if (!token) {
      router.push('/email_verification_page'); // Redirect if no token
      return;
    }

    const payload = decodeToken(token);
    if (!payload) {
      router.push('/email_verification_page'); // Redirect if token is invalid
      console.log(payload)
      return;
    }

    const isAuthorized = Object.keys(requiredSteps).every(key => requiredSteps[key] === payload.step);

    if (!isAuthorized) {
      router.push({}); // Redirect if not authorized
    }
  }, [router, requiredSteps]);

  // Optionally show a loading spinner or fallback UI while checking
  return <>{children}</>;
};

export default PrivateRouter;
